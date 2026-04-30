import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const value = process.argv[2];
const displayName = process.argv[3] || titleCase(value || '');
const shouldRegister = !process.argv.includes('--no-register');

if (!value || !/^[a-z][a-z0-9-]*$/.test(value)) {
  console.error('Usage: node scripts/create-design.mjs <kebab-design-name> [Display Name] [--no-register]');
  process.exit(1);
}

const designDir = join('_includes', 'designs', value);
const sassDir = join('_sass', value);
const assetEntry = join('assets', 'css', `${value}.scss`);
const bundleEntry = join('_sass', `_site-${value}.scss`);
const registryPath = join('_data', 'designs.yml');

const plannedFiles = [
  join(designDir, 'home.html'),
  join(designDir, 'projects.html'),
  join(designDir, 'cv.html'),
  join(designDir, 'case.html'),
  join(sassDir, '_tokens.scss'),
  join(sassDir, '_layout.scss'),
  join(sassDir, '_responsive.scss'),
  assetEntry,
  bundleEntry
];

const existing = plannedFiles.filter((file) => existsSync(file));
if (existing.length > 0) {
  console.error(`Refusing to overwrite existing files:\n${existing.map((file) => ` - ${file}`).join('\n')}`);
  process.exit(1);
}

mkdirSync(designDir, { recursive: true });
mkdirSync(sassDir, { recursive: true });

writeFileSync(join(designDir, 'home.html'), `{% assign profile = site.data.profile %}
<section class="${value}-design ${value}-home" data-design-root="${value}" aria-label="Home - ${displayName} view">
  <header class="${value}-hero">
    <p class="eyebrow">{{ profile.role }}</p>
    <h1 data-content-key="page-title" data-content-value="{{ profile.headline | strip_html | normalize_whitespace }}">{{ profile.headline }}</h1>
    <p data-content-key="home-summary" data-content-value="{{ profile.summary | strip_html | normalize_whitespace }}">{{ profile.summary }}</p>
    <div class="button-row">
      <a href="{{ '/projects/' | relative_url }}" class="button button--primary" data-content-list="home-hero-actions" data-content-key="/projects/" data-content-value="View work">View work</a>
      <a href="{{ profile.cv_pdf | relative_url }}" class="button button--secondary" target="_blank" rel="noopener noreferrer" data-content-list="home-hero-actions" data-content-key="{{ profile.cv_pdf }}" data-content-value="Download CV">Download CV</a>
    </div>
  </header>
</section>
`);

writeFileSync(join(designDir, 'projects.html'), `{% assign work_copy = site.data.page_copy.work %}
<section class="${value}-design ${value}-projects" data-design-root="${value}" aria-label="Selected work - ${displayName} view">
  <header class="${value}-page-head">
    <p class="eyebrow">{{ work_copy.eyebrow }}</p>
    <h1 data-content-key="page-title" data-content-value="{{ work_copy.headline | strip_html | normalize_whitespace }}">{{ work_copy.headline }}</h1>
    <p>{{ work_copy.intro }}</p>
  </header>
  {% for item in site.data.work %}
  <article class="${value}-project" data-content-list="project-titles" data-content-key="{{ item.slug }}" data-content-value="{{ item.title | strip_html | normalize_whitespace }}">
    <p class="eyebrow">{{ item.category }}</p>
    <h2>{{ item.title }}</h2>
    <p data-content-list="project-descriptions" data-content-key="{{ item.slug }}" data-content-value="{{ item.description | strip_html | normalize_whitespace }}">{{ item.description }}</p>
    {% include project-summary-grid.html item=item %}
    {% include project-highlights.html item=item limit=item.highlights.size %}
    {% include action-links.html links=item.links parity_list="project-actions" %}
  </article>
  {% endfor %}
</section>
`);

writeFileSync(join(designDir, 'cv.html'), `{% assign profile = site.data.profile %}
{% assign cv_copy = site.data.page_copy.cv %}
{% assign cv_data = site.data.cv %}
<section class="${value}-design ${value}-cv" data-design-root="${value}" aria-label="Curriculum Vitae - ${displayName} view">
  <header class="${value}-page-head">
    <p class="eyebrow">Curriculum vitae</p>
    <h1 data-content-key="page-title" data-content-value="{{ profile.name | strip_html | normalize_whitespace }}">{{ profile.name }}</h1>
    <p>{{ profile.role }}</p>
  </header>
  {% for entry in cv_data.experience %}
  <article data-cv-entry="experience:{{ entry.id }}" data-content-list="cv-experience" data-content-key="{{ entry.id }}" data-content-value="{{ entry.title | strip_html | normalize_whitespace }}">
    <h2>{{ entry.title }}</h2>
    <p>{{ entry.organization }} / {{ entry.period }}</p>
    <p>{{ entry.summary }}</p>
  </article>
  {% endfor %}
  {% for entry in cv_data.education %}
  <article data-cv-entry="education:{{ entry.id }}" data-content-list="cv-education" data-content-key="{{ entry.id }}" data-content-value="{{ entry.title | strip_html | normalize_whitespace }}">
    <h2>{{ entry.title }}</h2>
    <p>{{ entry.organization }} / {{ entry.period }}</p>
  </article>
  {% endfor %}
</section>
`);

writeFileSync(join(designDir, 'case.html'), `{% include designs/default/case-study.html project_slug=include.project_slug %}
`);

writeFileSync(assetEntry, `---
---

@import "site-${value}";
`);

writeFileSync(bundleEntry, `/* ==========================================================================
   ${displayName} design bundle
   ========================================================================== */

@import "shared/design-contract";
@import "${value}/tokens";
@import "${value}/layout";
@import "${value}/responsive";
`);

writeFileSync(join(sassDir, '_tokens.scss'), `[data-style="${value}"] {
  --${value}-surface: var(--surface-solid);
  --${value}-text: var(--text);
}
`);

writeFileSync(join(sassDir, '_layout.scss'), `.${value}-design {
  display: none;
  max-width: var(--content);
  margin: 0 auto;
  padding: var(--section-pad) var(--gutter);
}

[data-style="${value}"] .${value}-design {
  display: grid;
  gap: var(--cluster-gap);
}
`);

writeFileSync(join(sassDir, '_responsive.scss'), `@media (max-width: 760px) {
  [data-style="${value}"] .${value}-design {
    padding-inline: var(--gutter);
  }
}
`);

if (shouldRegister) {
  const registry = readFileSync(registryPath, 'utf8');
  if (registry.includes(`value: "${value}"`) || registry.includes(`value: '${value}'`)) {
    console.warn(`${value} already appears in _data/designs.yml; files were created but registry was not changed.`);
  } else {
    writeFileSync(registryPath, `${registry.trimEnd()}

- value: "${value}"
  name: "${displayName}"
  description: "New portfolio design"
  icon: "text"
  stylesheet: "/assets/css/${value}.css"
  css_budget_kb: 80
  includes:
    home: "designs/${value}/home.html"
    projects: "designs/${value}/projects.html"
    cv: "designs/${value}/cv.html"
    case: "designs/${value}/case.html"
`);
  }
}

console.log(`Created ${displayName} design scaffold at ${designDir}`);

function titleCase(input) {
  return input
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
