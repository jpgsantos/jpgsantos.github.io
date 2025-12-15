# João Pedro Gomes dos Santos - Personal Website

This is the repository for my personal website showcasing my professional background, projects, and skills. The site is built using Jekyll and hosted on GitHub Pages.

## Directory Structure

```
.
├── _config.yml               # Jekyll configuration file
├── index.md                  # Homepage
├── about.md                  # About page
├── projects.md               # Projects page
├── cv.md                     # CV/Resume page
├── contact.md                # Contact page
├── _layouts                  # Folder for layout templates
│   └── default.html          # Main layout template
├── assets                    # Folder for static assets
│   ├── images                # Folder for images
│   │   └── Profile.jpg       # Your profile photo
│   ├── js                    # JavaScript files
│   │   ├── animations.js     # Centralized animation scripts
│   │   └── theme-switcher.js # Theme switching functionality
│   ├── pdfs                  # Folder for PDF files
│   │   └── Joao_Pedro_Santos_CV.pdf  # Your CV in PDF format
│   └── style.css             # Main stylesheet
│   └── theme.css             # Theme styling and variables
```

## Setup Instructions

### Prerequisites

- Ruby (version 2.5.0 or higher)
- RubyGems
- GCC and Make

### Local Development

1. Install Jekyll and Bundler:
   ```
   gem install jekyll bundler
   ```

2. Clone this repository:
   ```
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

3. Install dependencies:
   ```
   bundle install
   ```

4. Run the Jekyll site locally:
   ```
   bundle exec jekyll serve
   ```

5. Open your browser and navigate to: `http://localhost:4000`

### Publishing to GitHub Pages

1. Create a repository named `username.github.io`, where `username` is your GitHub username.

2. Push the contents of this repository to the GitHub repository:
   ```
   git remote add origin https://github.com/username/username.github.io.git
   git push -u origin main
   ```

3. Your site will be available at `https://username.github.io`

## File Placement

- Make sure your profile photo is placed in `assets/images/Profile.jpg`
- Make sure your CV PDF is placed in `assets/pdfs/Joao_Pedro_Santos_CV.pdf`

## Customization

- Edit `_config.yml` to update site-wide settings
- Modify content in Markdown files to update page content
- Change styles in `assets/css/main.css` and the partials in `assets/css/` to customize appearance

## License

This project is licensed under the MIT License - see the LICENSE file for details.