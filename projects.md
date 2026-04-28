---
layout: default
title: Work
description: "Selected work by João Pedro Santos across scientific software, Android product engineering, and quantitative research."
permalink: /projects/
---

{% include projects-mondrian.html %}

<div class="default-only" data-design-root="default">

{% assign work_copy = site.data.page_copy.work %}

<section class="page-hero">
  <p class="eyebrow">{{ work_copy.eyebrow }}</p>
  <h1>{{ work_copy.headline }}</h1>
  <p>{{ work_copy.intro }}</p>
  <aside class="work-hero-index" aria-label="Project index">
    {% for item in site.data.work %}
    <a href="#default-work-{{ item.slug }}">
      <span>0{{ forloop.index }}</span>
      <strong>{{ item.title }}</strong>
      <small>{{ item.category }}</small>
    </a>
    {% endfor %}
  </aside>
</section>

<section class="section-block">
  {% for item in site.data.work %}
  {% assign modifier = "research" %}
  {% if item.slug == "subcellular-workflow" %}
    {% assign modifier = "workflow" %}
  {% elsif item.slug == "octidy-android-app" %}
    {% assign modifier = "app" %}
  {% endif %}
  <article class="project-feature project-feature--{{ modifier }}" id="default-work-{{ item.slug }}" data-reveal>
    <div class="project-feature__content">
      <p class="eyebrow">{{ item.eyebrow }}</p>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
      <div class="work-summary-grid">
        <div><strong>Problem</strong><span>{{ item.problem }}</span></div>
        <div><strong>Contribution</strong><span>{{ item.contribution }}</span></div>
        <div><strong>Outcome</strong><span>{{ item.outcome }}</span></div>
      </div>
      <ul class="check-list">
        {% for highlight in item.highlights %}
        <li>{% include icon.html name="check" %}<span>{{ highlight }}</span></li>
        {% endfor %}
      </ul>
      {% include chip-list.html class="tag-list" items=item.stack %}
      {% include action-links.html links=item.links %}
    </div>

    {% if item.slug == "subcellular-workflow" %}
    <div class="project-feature__media project-feature__media--workflow">
      <div class="workflow-card">
        <div class="workflow-card__header">
          <p class="eyebrow">Architecture</p>
          <strong>Reusable ODE modeling pipeline</strong>
          <span>From model setup through simulation, parameter estimation, sensitivity analysis, and result validation.</span>
        </div>
        {% include workflow-diagram.html %}
        <div class="workflow-card__footer" aria-label="Workflow outputs">
          <span>FAIR structure</span>
          <span>MATLAB solvers</span>
          <span>COPASI bridge</span>
        </div>
      </div>
    </div>
    {% elsif item.slug == "octidy-android-app" %}
    <div class="project-feature__media project-feature__media--app">
      <div class="app-carousel" data-carousel aria-label="Octidy Android app screenshots">
        <div class="app-carousel__viewport" tabindex="0">
          {% for shot in item.screenshots %}
          <figure class="app-slide">
            <div class="phone-frame">
              {% include project-screenshot.html src=shot.src alt=shot.alt loading="lazy" width="1080" height="2400" %}
            </div>
            <figcaption><strong>{{ shot.caption }}</strong><span>{{ shot.alt | remove: 'Octidy ' | capitalize }}.</span></figcaption>
          </figure>
          {% endfor %}
        </div>
        <div class="app-carousel__controls" aria-label="Octidy screenshot controls">
          <button class="carousel-button" type="button" data-carousel-prev aria-label="Previous screenshot">{% include icon.html name="chevron-up" %}</button>
          <div class="app-carousel__dots">
            {% for shot in item.screenshots %}
            <button type="button" data-carousel-dot {% if forloop.first %}aria-current="true"{% endif %}>{{ shot.caption }}</button>
            {% endfor %}
          </div>
          <button class="carousel-button" type="button" data-carousel-next aria-label="Next screenshot">{% include icon.html name="chevron-up" %}</button>
        </div>
      </div>
    </div>
    {% else %}
    <div class="project-feature__media project-feature__media--research">
      <div class="research-visual" role="img" aria-label="Porphyrin synthesis and spectroscopy analysis workflow">
        <div class="research-visual__molecule" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="research-visual__panel">
          <p class="eyebrow">Materials workflow</p>
          <strong>Ionic self-assembly</strong>
          <span>Synthesis, purification, spectroscopy, and quantitative signal analysis.</span>
        </div>
        <div class="spectrum-mini" aria-hidden="true">
          <span style="height: 28%"></span>
          <span style="height: 72%"></span>
          <span style="height: 46%"></span>
          <span style="height: 88%"></span>
          <span style="height: 36%"></span>
          <span style="height: 58%"></span>
        </div>
      </div>
    </div>
    {% endif %}
  </article>
  {% endfor %}
</section>

<section class="section-block section-block--cta">
  <h2>{{ work_copy.cta_heading }}</h2>
  <p>{{ work_copy.cta_text }}</p>
  <div class="button-row">
    <a href="{{ '/cv/' | relative_url }}" class="button button--primary">
      {% include icon.html name="file" %} View CV
    </a>
    <a href="{{ '/#contact' | relative_url }}" class="button button--secondary">
      {% include icon.html name="email" %} Contact
    </a>
  </div>
</section>

</div>
