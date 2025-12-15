---
layout: default
title: Home
description: "João Pedro Gomes dos Santos - Computational Neuroscience PhD and Scientific Software Developer specializing in biological modeling and algorithm implementation."
---

<div class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-content">
    <div class="attributes-list">
      <h2>
        <span class="attribute-item">PhD in Computational Neuroscience</span>
        <span class="attribute-item">Data Scientist</span>
        <span class="attribute-item">Scientific Software Developer</span>
        <span class="attribute-item">Biological Modeling Expert</span>
      </h2>
    </div>
    
    <div class="hero-main-content">
      <div class="hero-image-container">
        <div class="hero-image-border">
          <img src="{{ '/assets/images/Profile.jpg' | relative_url }}" alt="João Pedro Gomes dos Santos" class="hero-image" loading="eager">
        </div>
      </div>
      
      <div class="hero-text">
        <p class="hero-description">I transform complex biological systems into computational models and develop scientific software that makes a difference.</p>
        <div class="location-badge">
          <i class="fas fa-map-marker-alt"></i> Seeking opportunities in Copenhagen/Remote
        </div>
        <div class="hero-buttons">
          <a href="{{ '/cv' | relative_url }}" class="hero-button primary-button">
            <i class="fas fa-file-alt"></i> View CV
          </a>
          <a href="{{ '/projects' | relative_url }}" class="hero-button secondary-button">
            <i class="fas fa-laptop-code"></i> Projects
          </a>
          <a href="{{ '/contact' | relative_url }}" class="hero-button secondary-button">
            <i class="fas fa-envelope"></i> Contact
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<section class="section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-star"></i></span> Areas of Expertise</h2>
  {% include expertise-grid.html %}
</section>

<section class="featured-project">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-award"></i></span> Featured Project</h2>
  
  {% include featured-project.html %}
  
  <div class="view-more-projects">
    <a href="{{ '/projects' | relative_url }}" class="view-more-link">
      View All Projects <i class="fas fa-arrow-right"></i>
    </a>
  </div>
</section>