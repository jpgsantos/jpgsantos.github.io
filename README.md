# João Pedro Gomes dos Santos - Personal Website

Personal portfolio for João Pedro Gomes dos Santos, built with Jekyll and hosted on GitHub Pages.

## Structure

```text
.
├── _config.yml
├── index.md              # Home, about summary, selected work, contact CTA
├── projects.md           # Work overview
├── projects/
│   ├── subcellular-workflow.md
│   └── octidy-android-app.md
├── cv.md                 # Full CV reference
├── about.md              # Redirects to /#about
├── contact.md            # Redirects to /#contact
├── _data/
│   ├── profile.yml       # Canonical identity, contact, proof points
│   ├── work.yml          # Canonical project overview data
│   ├── skills.yml
│   ├── timeline.yml
│   └── publications.yml
├── _includes/
├── _layouts/
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

## Assets

- Profile image: `assets/images/profile.jpg`
- CV PDF: `assets/PDFs/Joao_Pedro_Santos_CV.pdf`
- Octidy screenshots:
  - `assets/images/projects/octidy-dashboard.png`
  - `assets/images/projects/octidy-bidding.png`
  - `assets/images/projects/octidy-create-task.png`
  - `assets/images/projects/octidy-assigned-task.png`
  - `assets/images/projects/octidy-calendar.png`
