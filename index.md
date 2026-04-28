---
layout: default
title: Home
description: "João Pedro Gomes dos Santos - AI / Systems Engineer, founder of Octidy, and Computational Neuroscience PhD specializing in scientific software and biological modeling."
---

{% include home-mondrian.html %}

<div class="default-only">

{% assign profile = site.data.profile %}

<section class="hero technical-hero">
  <div class="hero__content">
    <p class="eyebrow">{{ profile.role }}</p>
    <h1>{{ profile.headline }}</h1>
    <p class="hero__summary">{{ profile.summary }}</p>
    <div class="hero__actions button-row">
      <a href="{{ '/projects/' | relative_url }}" class="button button--primary">
        View work {% include icon.html name="arrow-right" %}
      </a>
      <a href="{{ profile.cv_pdf | relative_url }}" class="button button--secondary" target="_blank" rel="noopener noreferrer">
        {% include icon.html name="download" %} Download CV
      </a>
    </div>
    <div class="availability-strip">
      {% include icon.html name="location" %}
      <span>Current: {{ profile.current_work }}</span>
    </div>
  </div>

  <div class="hero__visual" aria-label="Technical profile summary">
    <canvas class="neural-canvas" data-neural aria-hidden="true"></canvas>
    <div class="profile-console">
      <div class="profile-console__header">
        {% include profile-image.html class="profile-console__photo" loading="eager" fetchpriority="high" width="180" height="180" sizes="76px" %}
        <div>
          <p class="eyebrow">Technical focus</p>
          <h2>Modeling + implementation</h2>
        </div>
      </div>
      <div class="metric-grid">
        {% for metric in profile.metrics %}
        <div><strong>{{ metric.value }}</strong><span>{{ metric.label }}</span></div>
        {% endfor %}
      </div>
      <div class="signal-list">
        {% for skill in profile.skill_chips %}
        <span>{{ skill }}</span>
        {% endfor %}
      </div>
    </div>
    <div class="hero-proof" aria-label="Professional focus">
      {% for proof in profile.proof_points %}
      <span><strong>{{ proof.title }}</strong> {{ proof.text }}</span>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section-block" id="about">
  <div class="section-intro section-intro--left">
    <p class="eyebrow">About</p>
    <h2>{{ profile.about_heading }}</h2>
  </div>
  <div class="prose-grid">
    <div class="prose">
      <p>{{ profile.about }}</p>
      <p>{{ profile.about_background }}</p>
    </div>
    <div class="values-grid values-grid--compact">
      {% for principle in profile.principles %}
      <article class="surface-card" data-reveal>
        <div class="surface-card__icon">{% include icon.html name=principle.icon %}</div>
        <h3>{{ principle.title }}</h3>
        <p>{{ principle.description }}</p>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section-block">
  <div class="section-intro">
    <p class="eyebrow">Selected work</p>
    <h2>{{ profile.selected_work_heading }}</h2>
    <p>{{ profile.selected_work_intro }}</p>
  </div>
  <div class="two-column">
    {% for item in site.data.work limit:2 %}
    <article class="surface-card" data-reveal>
      <div class="surface-card__icon">{% include icon.html name=item.icon %}</div>
      <p class="eyebrow">{{ item.category }}</p>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
      <a href="{{ item.url | relative_url }}" class="text-link">
        Read case study {% include icon.html name="arrow-right" %}
      </a>
    </article>
    {% endfor %}
  </div>
</section>

<section class="section-block">
  <div class="section-intro">
    <p class="eyebrow">Technical toolkit</p>
    <h2>{{ profile.toolkit_heading }}</h2>
  </div>
  <div class="three-column">
    {% for area in profile.focus_areas %}
    <article class="surface-card" data-reveal>
      <div class="surface-card__icon">{% include icon.html name=area.icon %}</div>
      <h3>{{ area.title }}</h3>
      <p>{{ area.description }}</p>
    </article>
    {% endfor %}
  </div>
  <div class="tag-cloud tag-cloud--centered" aria-label="Core stack">
    {% for skill in profile.skill_chips %}
    <span>{{ skill }}</span>
    {% endfor %}
  </div>
</section>

<section class="section-block" id="contact" data-contact-anchor="default">
  <div class="section-intro">
    <p class="eyebrow">Contact</p>
    <h2>{{ profile.contact_heading }}</h2>
    <p>{{ profile.contact_intro }}</p>
  </div>
  <div class="contact-grid">
    <a href="mailto:{{ profile.contact.email }}" class="contact-card contact-card--compact contact-card--email">
      {% include icon.html name="email" %}
      <span><strong>Email</strong>{{ profile.contact.email }}</span>
      {% include icon.html name="arrow-right" %}
    </a>
    <a href="tel:{{ profile.contact.phone_uri }}" class="contact-card contact-card--compact">
      {% include icon.html name="phone" %}
      <span><strong>Phone</strong>{{ profile.contact.phone }}</span>
      {% include icon.html name="arrow-right" %}
    </a>
    {% for social in profile.socials %}
    {% assign item = social[1] %}
    <a href="{{ item.url }}" target="_blank" rel="noopener noreferrer" class="contact-card contact-card--compact">
      {% include icon.html name=item.icon %}
      <span><strong>{{ item.label }}</strong>{{ item.username }}</span>
      {% include icon.html name="arrow-right" %}
    </a>
    {% endfor %}
  </div>
</section>

</div>
