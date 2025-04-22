---
layout: default
title: Home
---

<div class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-content">
  <div class="attributes-list">
    <h2>
      <span class="attribute-item">PhD in Computational Neuroscience</span>
      <span class="attribute-item">Scientific Software Developer</span>
      <span class="attribute-item">Algorithm Implementation Specialist</span>
      <span class="attribute-item">Biological Modeling Expert</span>
    </h2>
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
    <div class="hero-image-container">
      <div class="hero-image-border">
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
/* Enhanced hero section styles */
.hero-section {
  position: relative;
  min-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0;
  margin-bottom: var(--section-spacing);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--white) 100%);
  z-index: 0;
}

.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(var(--primary-light) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 4em;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 3;
  max-width: 600px;
}

.hero-text h1 {
  font-size: 2.5em;
  color: var(--primary-color);
  margin-bottom: 0.2em;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.2em;
  margin-bottom: 1.5em;
  color: var(--text-dark);
  line-height: 1.6;
}

.hero-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 2em;
}

.hero-image-border {
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%;
  overflow: hidden;
  box-shadow: 0 15px 30px var(--shadow-strong);
  animation: morph 8s ease-in-out infinite;
  border: 5px solid var(--white);
}

@keyframes morph {
  0% { border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; }
  50% { border-radius: 40% 60% 40% 60% / 60% 40% 60% 40%; }
  100% { border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; }
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.hero-buttons {
  display: flex;
  gap: 1em;
  margin-top: 2em;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.8em 1.8em;
  border-radius: 50px;
  font-weight: 600;
  transition: all var(--transition);
  box-shadow: 0 4px 8px var(--shadow);
  min-width: 160px;
}

.hero-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px var(--shadow-strong);
}

/* Attributes list styling */
.attributes-list h2 {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  font-size: 1.4em;
  color: var(--primary-color);
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0 0 1em 0;
  line-height: 1.3;
  height: auto;
}

.attribute-item {
  position: relative;
  display: inline;
  opacity: 0.9;
  margin-right: 1em;
}

.attribute-item:not(:last-child)::after {
  content: "•";
  margin-left: 1em;
  opacity: 0.7;
}


.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 0.5em 1em;
  border-radius: 50px;
  font-size: 0.9em;
  font-weight: 600;
  margin-top: 1em;
  box-shadow: 0 2px 5px var(--shadow);
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
    font-size: 2.2em;
  }
  
  .hero-image-border {
    width: 200px;
    height: 200px;
  }
  
  .attributes-list h2 {
    font-size: 1.2em;
  }
}

/* Hero Section Fixes */
.hero-section {
  position: relative;
  min-height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0;
  margin-bottom: var(--section-spacing);
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 4em;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 3;
  max-width: 600px;
}

.hero-text h1 {
  font-size: 2.5em;
  color: var(--primary-color);
  margin-bottom: 0.2em;
  line-height: 1.2;
}

/* Attributes list styling */
.attributes-list h2 {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  font-size: 1.4em;
  color: var(--primary-color);
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0 0 1em 0;
  line-height: 1.3;
  height: auto;
}

.attribute-item {
  position: relative;
  display: block;
  opacity: 0.9;
  margin-bottom: 0.3em;
}

.hero-image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 2em;
}

.hero-image-border {
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%;
  overflow: hidden;
  box-shadow: 0 15px 30px var(--shadow-strong);
  animation: morph 8s ease-in-out infinite;
  border: 5px solid var(--white);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
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
  }
  
  .hero-image-container {
    padding-left: 0;
    margin-bottom: 2em;
  }
  
  .hero-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-text h1 {
    font-size: 2.2em;
  }
  
  .hero-image-border {
    width: 200px;
    height: 200px;
  }
  
  .attributes-list h2 {
    font-size: 1.2em;
	justify-content: center;
  }
  
  .attribute-item {
    margin-bottom: 0.5em;
  }
}
}
</style>