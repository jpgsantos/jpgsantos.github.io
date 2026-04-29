# João Pedro Gomes dos Santos - Personal Website

Personal portfolio for João Pedro Gomes dos Santos, built with Jekyll and hosted on GitHub Pages.

## Structure

```text
.
├── _config.yml
├── index.md              # Home page shell; renders each design include
├── projects.md           # Work page shell; renders each design include
├── cv.md                 # CV page shell; renders each design include
├── about.md              # Redirects to /#about
├── contact.md            # Redirects to /#contact
├── _data/
│   ├── designs.yml       # Design registry, stylesheets, and CSS budgets
│   ├── profile.yml       # Canonical identity, contact, proof points
│   ├── work.yml          # Canonical project overview data
│   ├── cv.yml            # Canonical CV experience and education entries
│   ├── skills.yml
│   └── publications.yml
├── _includes/
│   ├── designs/
│   │   ├── default/      # Default design renderers
│   │   └── mondrian/     # Mondrian design renderers
│   └── *.html            # Shared components
├── _sass/                # Sass partials compiled from assets/css/*.scss
└── assets/
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

## Adding A Design

1. Add the design to `_data/designs.yml` with `value`, `name`, `description`, `icon`, `stylesheet`, and `css_budget_kb`.
2. Add renderers under `_includes/designs/<design>/home.html`, `_includes/designs/<design>/projects.html`, and `_includes/designs/<design>/cv.html`.
3. Keep each design root marked with `data-design-root="<design>"` so switching, accessibility hiding, and audits work.
4. Reuse canonical content from `_data/profile.yml`, `_data/work.yml`, `_data/cv.yml`, `_data/skills.yml`, and `_data/publications.yml`.
5. Add a Sass entrypoint in `assets/css/<design>.scss` and put the implementation in `_sass/`.
6. Run `npm test` and `node scripts/audit-site.mjs --base-url=<local-url>`.

## Assets

- Profile image: `assets/images/profile.jpg`
- CV PDF: `assets/PDFs/Joao_Pedro_Santos_CV.pdf`
- Octidy screenshots: `assets/images/projects/`
