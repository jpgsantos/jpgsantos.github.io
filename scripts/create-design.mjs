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
const partialsDir = join(designDir, 'partials');
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
  join(sassDir, '_overrides.scss'),
  assetEntry,
  bundleEntry
];

const existing = plannedFiles.filter((file) => existsSync(file));
if (existing.length > 0) {
  console.error(`Refusing to overwrite existing files:\n${existing.map((file) => ` - ${file}`).join('\n')}`);
  process.exit(1);
}

mkdirSync(designDir, { recursive: true });
mkdirSync(partialsDir, { recursive: true });
mkdirSync(sassDir, { recursive: true });

writeFileSync(join(designDir, 'home.html'), `{% assign profile = site.data.profile %}
<section class="${value}-design ${value}-home" data-design-root="${value}" aria-label="Home - ${displayName} view">
  <header class="${value}-page-head">
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
  <article class="${value}-project" id="${value}-work-{{ item.slug }}">
    <p class="eyebrow">{{ item.category }}</p>
    <h2 data-content-list="project-titles" data-content-key="{{ item.slug }}" data-content-value="{{ item.title | strip_html | normalize_whitespace }}">{{ item.title }}</h2>
    <p data-content-list="project-descriptions" data-content-key="{{ item.slug }}" data-content-value="{{ item.description | strip_html | normalize_whitespace }}">{{ item.description }}</p>
    <div class="${value}-summary">
      <p data-content-list="project-summary" data-content-key="{{ item.slug }}:problem" data-content-value="{{ item.problem | strip_html | normalize_whitespace }}"><strong>Problem</strong> {{ item.problem }}</p>
      <p data-content-list="project-summary" data-content-key="{{ item.slug }}:contribution" data-content-value="{{ item.contribution | strip_html | normalize_whitespace }}"><strong>Contribution</strong> {{ item.contribution }}</p>
      <p data-content-list="project-summary" data-content-key="{{ item.slug }}:outcome" data-content-value="{{ item.outcome | strip_html | normalize_whitespace }}"><strong>Outcome</strong> {{ item.outcome }}</p>
    </div>
    <ul>
      {% for highlight in item.highlights %}
      <li data-content-list="project-highlights" data-content-key="{{ item.slug }}:{{ forloop.index }}" data-content-value="{{ highlight | strip_html | normalize_whitespace }}">{{ highlight }}</li>
      {% endfor %}
    </ul>
    {% include chip-list.html class="tag-list" items=item.stack %}
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

writeFileSync(join(designDir, 'case.html'), `{% assign case_project = site.data.work | where: "slug", include.project_slug | first %}
{% assign case_data = case_project.case %}
{% if case_data %}
<section class="${value}-design ${value}-case" data-design-root="${value}" aria-label="{{ case_data.title }} case study - ${displayName} view">
  <header class="${value}-page-head">
    <p class="eyebrow">{{ case_data.eyebrow }}</p>
    <h1 data-content-key="page-title" data-content-value="{{ case_data.title | strip_html | normalize_whitespace }}">{{ case_data.title }}</h1>
    <p data-content-key="case-lede" data-content-value="{{ case_data.lede | strip_html | normalize_whitespace }}">{{ case_data.lede }}</p>
    {% include action-links.html links=case_data.hero_actions parity_list="case-hero-actions" %}
  </header>
  {% include case-visual.html design="${value}" visual=case_data.visual screenshots=case_data.case_screenshots %}
  {% for item in case_data.overview %}
  <article data-content-list="case-overview" data-content-key="{{ item.label | slugify }}" data-content-value="{{ item.title | strip_html | normalize_whitespace }}">
    <p class="eyebrow">{{ item.label }}</p>
    <h2>{{ item.title }}</h2>
    <p>{{ item.body }}</p>
  </article>
  {% endfor %}
  {% for section in case_data.sections %}
  <section data-content-list="case-sections" data-content-key="{{ section.label | slugify }}" data-content-value="{{ section.title | strip_html | normalize_whitespace }}">
    <p class="eyebrow">{{ section.label }}</p>
    <h2>{{ section.title }}</h2>
    {% for feature in section.features %}
    <article data-content-list="case-features" data-content-key="{{ section.label | slugify }}:{{ feature.title | slugify }}" data-content-value="{{ feature.title | strip_html | normalize_whitespace }}">
      <h3>{{ feature.title }}</h3>
      <p>{{ feature.body }}</p>
    </article>
    {% endfor %}
  </section>
  {% endfor %}
</section>
{% endif %}
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
@import "${value}/overrides";
`);

writeFileSync(join(sassDir, '_tokens.scss'), `/* ${displayName} contract slots. Keep values design-owned. */
[data-style="${value}"] {
  --font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
  --font-display: var(--font-sans);
  --font-mono: var(--font-sans);

  --t-xs: 0.74rem;
  --t-sm: 0.9rem;
  --t-md: 1rem;
  --t-lg: clamp(1.35rem, 1.1rem + 1vw, 1.8rem);
  --t-xl: clamp(2.25rem, 1.6rem + 3.2vw, 3.6rem);

  --color-surface: #f8fbfa;
  --color-surface-raised: #ffffff;
  --color-ink: #16201d;
  --color-muted: #5c6965;
  --color-border: #d7e0dc;

  --rule-thickness: 1px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 14px;

  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;

  --density-row: 1.7;
  --density-gap: clamp(1rem, 2vw, 1.35rem);
  --section-pad: clamp(3rem, 6vw, 5rem);
  --gutter: clamp(1rem, 3vw, 2rem);

  --shadow-soft: 0 10px 24px rgba(21, 38, 35, 0.08);
  --shadow-strong: 0 22px 46px rgba(21, 38, 35, 0.12);
}

[data-style="${value}"][data-theme="dark"] {
  --color-surface: #101513;
  --color-surface-raised: #18201d;
  --color-ink: #eef6f2;
  --color-muted: #adbbb6;
  --color-border: #2b3934;
  --shadow-soft: 0 12px 30px rgba(0, 0, 0, 0.22);
  --shadow-strong: 0 22px 55px rgba(0, 0, 0, 0.3);
}
`);

writeFileSync(join(sassDir, '_overrides.scss'), `[data-style="${value}"] body {
  font-family: var(--font-sans);
  line-height: var(--density-row);
  color: var(--color-ink);
  background: var(--color-surface);
}

.${value}-design {
  display: none;
  max-width: 1180px;
  margin: 0 auto;
  padding: var(--section-pad) var(--gutter);
}

[data-style="${value}"] .${value}-design {
  display: grid;
  gap: var(--density-gap);
}

[data-style="${value}"] .${value}-design :where(article, section, header) {
  min-width: 0;
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
  case_visuals:
    screenshots: "designs/default/partials/case-visual-screenshots.html"
    workflow: "designs/default/partials/case-visual-workflow.html"
    porphyrin: "designs/default/partials/case-visual-porphyrin.html"
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
