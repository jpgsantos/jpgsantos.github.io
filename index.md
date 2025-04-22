---
layout: default
title: Home
---

<div class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-content">
    <div class="hero-text">
      <div class="attributes-list">
        <h2>
          <span class="attribute-item">PhD in Computational Neuroscience</span>
          <span class="attribute-item">Scientific Software Developer</span>
          <span class="attribute-item">Algorithm Implementation Specialist</span>
          <span class="attribute-item">Biological Modeling Expert</span>
        </h2>
      </div>
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
    <div class="hero-image-container">
      <div class="hero-image-border enlarged">
        <img src="{{ '/assets/images/Profile.jpg' | relative_url }}" alt="João Pedro Gomes dos Santos" class="hero-image">
      </div>
    </div>
  </div>
</div>

<section class="section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-star"></i></span> Areas of Expertise</h2>
  <div class="grid">
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-laptop-code"></i>
      </div>
      <h3>Scientific Software Development</h3>
      <p>Building robust, modular, and FAIR-compliant scientific tools with 8+ years of experience in MATLAB.</p>
      <div class="pills">
        <span>MATLAB</span>
        <span>Python</span>
        <span>Git</span>
        <span>FAIR Principles</span>
      </div>
    </div>
	
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-brain"></i>
      </div>
      <h3>Computational Modeling</h3>
      <p>Designing and implementing mathematical models of biological systems using ordinary differential equations.</p>
      <div class="pills">
        <span>ODE Modeling</span>
        <span>Parameter Estimation</span>
        <span>SimBiology</span>
        <span>COPASI</span>
      </div>
    </div>
	
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <h3>Algorithm Implementation</h3>
      <p>Translating complex scientific algorithms from literature into functional, efficient code for analysis.</p>
      <div class="pills">
        <span>Sensitivity Analysis</span>
        <span>Profile Likelihood Analysis</span>
        <span>Parameter Optimization</span>
      </div>
    </div>
  </div>
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

<style>
/* Enhanced profile picture */
.hero-image-border.enlarged {
  width: 300px;
  height: 300px;
}

/* Attributes list styling */
.attributes-list h2 {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  font-size: 1.8em;
  color: var(--primary-color);
  font-weight: 700;
  letter-spacing: 0.5px;
  height: 50px;
  margin: 0 0 1em 0;
}

.attribute-item {
  position: relative;
  display: block;
}

.attribute-item:not(:first-child) {
  position: relative;
  margin-top: 0.3em;
}

.attribute-item:not(:first-child)::before {
  content: '•';
  position: absolute;
  left: -1em;
  color: var(--primary-color);
}

@media (max-width: 992px) {
  .hero-content {
    flex-direction: column-reverse;
    text-align: center;
    padding: 2em 1em;
  }
  
  .hero-text {
    max-width: 100%;
    margin-bottom: 2em;
  }
  
  .attributes-list h2 {
    margin: 0 auto 1em auto;
    text-align: left;
    display: inline-block;
  }
  
  .hero-image-container {
    padding-left: 0;
  }
  
  .hero-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-text h1 {
    font-size: 2.5em;
  }
  
  .hero-image-border {
    width: 200px;
    height: 200px;
  }
}

</style>