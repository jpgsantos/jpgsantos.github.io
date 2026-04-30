# João Pedro Gomes dos Santos - Personal Website

Personal portfolio for João Pedro Gomes dos Santos, built with Jekyll and hosted on GitHub Pages.

## Structure

```text
.
|-- _config.yml
|-- index.md              # Home page shell; calls the design renderer
|-- projects.md           # Work page shell; calls the design renderer
|-- cv.md                 # CV page shell; calls the design renderer
|-- about.md              # Redirects to /#about
|-- contact.md            # Redirects to /#contact
|-- _data/
|   |-- designs.yml       # Design registry, stylesheets, renderer includes, CSS budgets
|   |-- profile.yml       # Canonical identity, contact, proof points
|   |-- work.yml          # Canonical project and case-study data
|   |-- cv.yml            # Canonical CV experience and education entries
|   |-- skills.yml
|   `-- publications.yml
|-- _includes/
|   |-- render-designs.html # Shared include that renders registered designs per page key
|   |-- designs/
|   |   |-- default/      # Default design renderers
|   |   `-- mondrian/     # Mondrian design renderers
|   `-- *.html            # Shared components and Liquid helpers
|-- _sass/                # Sass bundles and partials compiled from assets/css/*.scss
`-- assets/
```

## Local Development

Install Ruby, Bundler, and the project dependencies:

```bash
bundle install
```

Run the site locally:

```bash
bundle exec jekyll serve
```

Open `http://localhost:4000`.

Run the baseline checks:

```bash
npm test
```

Run the browser audit against a local server:

```bash
node scripts/audit-site.mjs --base-url=http://127.0.0.1:4000
```

Capture representative audit screenshots for visual review:

```bash
node scripts/audit-site.mjs --base-url=http://127.0.0.1:4000 --snapshots
```

## Adding A Design

1. Add the design to `_data/designs.yml` with `value`, `name`, `description`, `icon`, `stylesheet`, `css_budget_kb`, and an `includes` map.
2. Add renderers under `_includes/designs/<design>/` for each required page key: `home`, `projects`, `cv`, and `case`. Case pages pass `project_slug` to the shared renderer.
3. Keep each design root marked with `data-design-root="<design>"` so switching, accessibility hiding, and audits work.
4. Reuse canonical content from `_data/profile.yml`, `_data/work.yml`, `_data/cv.yml`, `_data/skills.yml`, and `_data/publications.yml`.
5. Prefer shared includes for repeated content structures (`case-*`, `project-*`, contact cards, chip/action lists) and keep design-specific includes focused on layout/composition.
6. Add `data-content-key` or `data-content-list` markers to any new design-specific content that should stay equivalent across designs; the audit compares these markers generically.
7. Add a Sass entrypoint in `assets/css/<design>.scss` and put the implementation in `_sass/<design>/`, using `_sass/_site-<design>.scss` as the design bundle. Keep shared multi-design behavior in `_sass/shared/`.
8. Run `npm test` and `node scripts/audit-site.mjs --base-url=<local-url>`. The audit verifies registry fields, include paths, content parity, inactive design hiding, image dimensions, responsive overflow, carousel behavior, and CSS budgets.

To scaffold the required files for a new design:

```bash
npm run design:create -- my-design "My Design"
```

## Assets

- Profile image: `assets/images/profile.jpg`
- CV PDF: `assets/PDFs/Joao_Pedro_Santos_CV.pdf`
- Octidy screenshots: `assets/images/projects/`
