---
layout: default
title: CV
description: "Curriculum Vitae of João Pedro Santos - current work, education, experience, skills, publications, and downloadable PDF resume."
permalink: /cv/
---

{% include cv-mondrian.html %}

<div class="default-only">

{% assign profile = site.data.profile %}
{% assign octidy = site.data.work | where: "slug", "octidy-android-app" | first %}
{% assign cv_copy = site.data.page_copy.cv %}

<section class="cv-hero">
  <div class="cv-hero__identity">
    {% include profile-image.html loading="eager" fetchpriority="high" width="180" height="180" sizes="128px" %}
    <div>
      <p class="eyebrow">Curriculum vitae</p>
      <h1>{{ profile.name }}</h1>
      <p>{{ profile.role }}</p>
      <div class="button-row">
        <a href="{{ profile.cv_pdf | relative_url }}" class="button button--primary" target="_blank" rel="noopener noreferrer">
          {% include icon.html name="download" %} Download CV
        </a>
        <a href="{{ '/#contact' | relative_url }}" class="button button--secondary">
          {% include icon.html name="email" %} Contact
        </a>
      </div>
    </div>
  </div>
  <div class="cv-contact-grid">
    <a href="mailto:{{ profile.contact.email }}">{% include icon.html name="email" %}<span>{{ profile.contact.email }}</span></a>
    <a href="tel:{{ profile.contact.phone_uri }}">{% include icon.html name="phone" %}<span>{{ profile.contact.phone }}</span></a>
    <span>{% include icon.html name="location" %}<span>{{ profile.location }}</span></span>
    <span>{% include icon.html name="flag" %}<span>{{ profile.citizenship }}</span></span>
    <a href="{{ profile.socials.linkedin.url }}" target="_blank" rel="noopener noreferrer">{% include icon.html name="linkedin" %}<span>{{ profile.socials.linkedin.username }}</span></a>
    <a href="{{ profile.socials.github.url }}" target="_blank" rel="noopener noreferrer">{% include icon.html name="github" %}<span>{{ profile.socials.github.username }}</span></a>
    <span>{% include icon.html name="language" %}<span>{{ profile.languages }}</span></span>
    <span>{% include icon.html name="briefcase" %}<span>Current: {{ profile.current_work }}</span></span>
  </div>
</section>

<section class="section-block">
  <div class="section-intro section-intro--left">
    <p class="eyebrow">{{ cv_copy.summary_eyebrow }}</p>
    <h2>{{ cv_copy.summary_heading }}</h2>
  </div>
  <div class="prose">
    <p>{{ profile.about }}</p>
    <p>{{ profile.summary }}</p>
  </div>
</section>

<section class="section-block">
  <div class="section-intro section-intro--left">
    <p class="eyebrow">{{ cv_copy.experience_eyebrow }}</p>
    <h2>{{ cv_copy.experience_heading }}</h2>
  </div>
  <div class="cv-list">
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>AI / Systems Engineer</h3>
          <p>Vectonomous Labs</p>
        </div>
        <span>Apr 2026 - Present</span>
      </div>
      <p>Working on applied AI systems across data, backend, machine learning, and agentic engineering workflows.</p>
      <ul class="compact-list">
        <li>Contributing to AI/ML systems, backend infrastructure, data pipelines, and intelligence services.</li>
        <li>Applying strong analytical and systems-thinking skills from computational neuroscience to practical engineering problems.</li>
        <li>Operating in a high-autonomy environment where architecture, implementation quality, and end-to-end ownership matter.</li>
      </ul>
    </article>
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>Founder</h3>
          <p>Octidy</p>
        </div>
        <span>2025 - Present</span>
      </div>
      <p>Founded and built Octidy, a Firebase-first Android app for coordinating household chores through bidding, assignment, and progress tracking.</p>
      <ul class="compact-list">
        <li>Built invite-code households, task creation, bidding deadlines, automatic assignment, tie handling, recurring chores, calendar views, and progress statistics.</li>
        <li>Implemented Kotlin, Jetpack Compose, Navigation Compose, Hilt, Coroutines/Flow, Firebase Auth, Firestore, offline persistence, and WorkManager.</li>
        <li>Owned product definition, architecture, UI/UX, debugging, documentation, production packaging, and Play Console testing.</li>
      </ul>
    </article>
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>PhD Researcher</h3>
          <p>University of Porto / Karolinska Institutet / KTH / SciLifeLab</p>
        </div>
        <span>Jan 2016 - Mar 2025</span>
      </div>
      <p><strong>Thesis:</strong> A workflow for developing biochemical pathway models using ordinary differential equations.</p>
      <ul class="compact-list">
        <li>Built Subcellular Workflow, a modular FAIR-compliant MATLAB framework for ODE-based pathway modeling with simulation, analysis, and parameterization capabilities.</li>
        <li>Implemented parameter estimation, local/global sensitivity analysis, and profile likelihood analysis.</li>
        <li>Validated on LIRMO, LIREM, TM-M, and G-PIPK models spanning ligand-receptor interactions, effector responses, CaMKII autophosphorylation dynamics, and basal ganglia signaling.</li>
        <li>Published in <a href="https://doi.org/10.1007/s12021-021-09546-3" target="_blank" rel="noopener noreferrer">Neuroinformatics</a>.</li>
      </ul>
    </article>
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>Research Scholar</h3>
          <p>UCIBIO @ REQUIMTE, University of Porto</p>
        </div>
        <span>Apr 2015 - Dec 2015</span>
      </div>
      <p>Conducted research on porphyrin nanomaterials via ionic self-assembly.</p>
      <ul class="compact-list">
        <li>Performed synthesis, purification, and characterization of materials.</li>
        <li>Analyzed IR spectrograms for species concentrations.</li>
        <li>Supervised two undergraduate students.</li>
        <li>Published in <a href="https://doi.org/10.1016/j.tet.2016.09.030" target="_blank" rel="noopener noreferrer">Tetrahedron</a>.</li>
      </ul>
    </article>
  </div>
</section>

<section class="section-block">
  <div class="section-intro section-intro--left">
    <p class="eyebrow">{{ cv_copy.work_reference_eyebrow }}</p>
    <h2>{{ cv_copy.work_reference_heading }}</h2>
  </div>
  <div class="cv-list">
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>{{ octidy.title }}</h3>
          <p>Kotlin, Jetpack Compose, Firebase</p>
        </div>
        <span>2025</span>
      </div>
      <p>{{ octidy.description }}</p>
      <p>The detailed project framing, stack, screenshots, and case-study links are maintained in the Work section to avoid repeating the same project narrative inside the CV.</p>
      <div class="button-row">
        <a href="{{ '/projects/octidy-android-app/' | relative_url }}" class="text-link">
          Read case study {% include icon.html name="arrow-right" %}
        </a>
        <a href="{{ '/projects/' | relative_url }}" class="text-link">
          View all work {% include icon.html name="arrow-right" %}
        </a>
      </div>
    </article>
  </div>
</section>

<section class="section-block">
  <div class="section-intro section-intro--left">
    <p class="eyebrow">{{ cv_copy.skills_eyebrow }}</p>
    <h2>{{ cv_copy.skills_heading }}</h2>
  </div>
  {% include skills-grid.html %}
</section>

<section class="section-block">
  <div class="section-intro section-intro--left">
    <p class="eyebrow">{{ cv_copy.education_eyebrow }}</p>
    <h2>{{ cv_copy.education_heading }}</h2>
  </div>
  <div class="cv-list">
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>PhD, Computational Neuroscience</h3>
          <p>University of Porto (FCUP/ICBAS/FMUP/GABBA)</p>
        </div>
        <span>Jan 2016 - Mar 2025</span>
      </div>
      <p>Completed doctoral coursework with a strong quantitative and computational focus through the GABBA doctoral program, including biostatistics, systems and synthetic bioinformatics, neurosciences, cellular and developmental biology, molecular microbiology and parasitology, and new therapies and technologies.</p>
      <p><strong>Thesis:</strong> A workflow for developing biochemical pathway models using ordinary differential equations.</p>
      <ul class="compact-list">
        <li>Designed an integrated ODE modeling workflow for model initialization, simulation, parameter estimation, sensitivity analysis, and profile likelihood analysis.</li>
        <li>Validated the framework across models of increasing complexity, from simple ligand-receptor systems to G-PIPK, a striatal signaling model integrating glutamatergic and cholinergic inputs.</li>
        <li>Coordinated collaborative development across three institutions using Git/GitHub and delivered end-user documentation.</li>
        <li>Published in Neuroinformatics and funded by Fundação para a Ciência e Tecnologia (FCT).</li>
      </ul>
    </article>
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>MSc, Biochemistry</h3>
          <p>University of Porto (FCUP, ICBAS)</p>
        </div>
        <span>2013 - 2015</span>
      </div>
      <p><strong>Grade:</strong> 16/20. Specialized in computational and analytical approaches to biochemistry, with coursework in computational biochemistry, bioinformatics, instrumental analysis, and bioanalytical chemistry.</p>
      <p><strong>Thesis:</strong> Exploring the Boundaries of Porphyrin Materials Synthesis by Ionic Self-Assembly.</p>
      <ul class="compact-list">
        <li>Performed synthesis, purification, and spectroscopic characterization of porphyrin nanostructures.</li>
        <li>Quantified spectroscopic data to determine species concentrations.</li>
        <li>Supervised two undergraduate students during extracurricular research internships.</li>
        <li>Research contributed to a publication in Tetrahedron.</li>
      </ul>
    </article>
    <article class="cv-entry" data-reveal>
      <div class="cv-entry__header">
        <div>
          <h3>BSc, Biochemistry</h3>
          <p>University of Porto (FCUP, ICBAS)</p>
        </div>
        <span>2010 - 2013</span>
      </div>
      <p><strong>Grade:</strong> 16/20. Completed a three-year program combining biological sciences with quantitative and analytical methods, including coursework in mathematics, statistical methods, and mathematical models.</p>
      <p>Completed a research internship at the Institute for Molecular and Cell Biology (i3S) on protein depletion and cell cycle regulation in <em>Drosophila melanogaster</em> wing disc development.</p>
    </article>
  </div>
</section>

<section class="section-block">
  <div class="section-intro section-intro--left">
    <p class="eyebrow">{{ cv_copy.publications_eyebrow }}</p>
    <h2>{{ cv_copy.publications_heading }}</h2>
  </div>
  {% include publications.html %}
</section>

</div>
