---
layout: default
title: Home
---

<div class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-content">
    <div class="hero-text">
      <h1 class="animated-text">João Pedro Gomes dos Santos</h1>
      <div class="typewriter">
        <h2 id="typewriter-text"></h2>
      </div>
      <p class="hero-description">I transform complex biological systems into computational models and develop scientific software that makes a difference.</p>
      <div class="location-badge">
        <i class="fas fa-map-marker-alt"></i> Seeking opportunities in Copenhagen or Remote
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

<div class="section-divider">
  <div class="divider-line"></div>
  <div class="divider-icon"><i class="fas fa-code"></i></div>
  <div class="divider-line"></div>
</div>

<section class="expertise-section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-star"></i></span> Areas of Expertise</h2>
  
  <div class="expertise-grid">
    <div class="expertise-card">
      <div class="expertise-icon">
        <i class="fas fa-laptop-code"></i>
      </div>
      <h3>Scientific Software Development</h3>
      <p>Building robust, modular, and FAIR-compliant scientific tools with 8+ years of experience in MATLAB.</p>
      <div class="expertise-skills">
        <span>MATLAB</span>
        <span>Python</span>
        <span>Git</span>
        <span>FAIR Principles</span>
      </div>
    </div>
    
    <div class="expertise-card">
      <div class="expertise-icon">
        <i class="fas fa-brain"></i>
      </div>
      <h3>Computational Modeling</h3>
      <p>Designing and implementing mathematical models of biological systems using ordinary differential equations.</p>
      <div class="expertise-skills">
        <span>ODE Modeling</span>
        <span>Parameter Estimation</span>
        <span>SimBiology</span>
        <span>COPASI</span>
      </div>
    </div>
    
    <div class="expertise-card">
      <div class="expertise-icon">
        <i class="fas fa-chart-line"></i>
      </div>
      <h3>Algorithm Implementation</h3>
      <p>Translating complex scientific algorithms from literature into functional, efficient code for analysis.</p>
      <div class="expertise-skills">
        <span>Sensitivity Analysis</span>
        <span>Profile Likelihood Analysis</span>
        <span>Parameter Optimization</span>
      </div>
    </div>
    
    <div class="expertise-card">
      <div class="expertise-icon">
        <i class="fas fa-lightbulb"></i>
      </div>
      <h3>Problem Solving</h3>
      <p>Approaching complex technical challenges with systematic debugging and analytical rigor.</p>
      <div class="expertise-skills">
        <span>Analytical Thinking</span>
        <span>AI/LLM Integration</span>
        <span>Rapid Learning</span>
        <span>Adaptability</span>
      </div>
    </div>
  </div>
</section>

<div class="section-divider">
  <div class="divider-line"></div>
  <div class="divider-icon"><i class="fas fa-project-diagram"></i></div>
  <div class="divider-line"></div>
</div>

<section class="featured-project">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-award"></i></span> Featured Project</h2>
  
  <div class="project-showcase">
    <div class="project-showcase-content">
      <h3>Subcellular_Workflow</h3>
      <div class="project-showcase-badges">
        <span class="project-badge"><i class="fas fa-calendar-alt"></i> 2016-2025</span>
        <span class="project-badge"><i class="fab fa-github"></i> Open Source</span>
        <span class="project-badge"><i class="fas fa-book"></i> Published</span>
      </div>
      <p class="project-showcase-description">
        A modular, FAIR-compliant MATLAB framework for ODE biochemical pathway modeling, analysis, and parameterization. The workflow integrates tools for model initialization, simulation, parameter estimation, and sensitivity analysis.
      </p>
      <ul class="project-showcase-features">
        <li><i class="fas fa-check"></i> Implemented complex algorithms from scientific literature</li>
        <li><i class="fas fa-check"></i> Engineered interfaces between MATLAB solvers and COPASI</li>
        <li><i class="fas fa-check"></i> Applied to analyze benchmark models in neuroscience</li>
        <li><i class="fas fa-check"></i> Published in peer-reviewed journal <em>Neuroinformatics</em></li>
      </ul>
      <div class="project-showcase-links">
        <a href="https://github.com/jpgsantos/Subcellular_Workflow" target="_blank" class="project-link">
          <i class="fab fa-github"></i> GitHub Repository
        </a>
        <a href="https://subcellular-workflow.readthedocs.io/" target="_blank" class="project-link">
          <i class="fas fa-book"></i> Documentation
        </a>
        <a href="https://doi.org/10.1007/s12021-021-09546-3" target="_blank" class="project-link">
          <i class="fas fa-file-alt"></i> Publication
        </a>
      </div>
    </div>
    <div class="project-showcase-visual">
      <div class="visual-container">
        <div class="diagram">
          <img src="{{ '/assets/images/workflow_diagram.svg' | relative_url }}" alt="Workflow Diagram" class="diagram-image">
        </div>
      </div>
    </div>
  </div>
  
  <div class="view-more-projects">
    <a href="{{ '/projects' | relative_url }}" class="view-more-link">
      View All Projects <i class="fas fa-arrow-right"></i>
    </a>
  </div>
</section>

<div class="section-divider">
  <div class="divider-line"></div>
  <div class="divider-icon"><i class="fas fa-user-graduate"></i></div>
  <div class="divider-line"></div>
</div>

<section class="journey-section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-road"></i></span> Professional Journey</h2>
  
  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-icon">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <div class="timeline-content">
        <h3>PhD in Computational Neuroscience</h3>
        <span class="timeline-date">2016 - 2025</span>
        <p>Developed the Subcellular_Workflow framework for ODE-based biochemical pathway modeling.</p>
        <span class="timeline-location">University of Porto / Karolinska Institutet</span>
      </div>
    </div>
    
    <div class="timeline-item">
      <div class="timeline-icon">
        <i class="fas fa-flask"></i>
      </div>
      <div class="timeline-content">
        <h3>Research Scholar</h3>
        <span class="timeline-date">2015</span>
        <p>Conducted research on porphyrin nanomaterials via ionic self-assembly.</p>
        <span class="timeline-location">UCIBIO @ REQUIMTE, University of Porto</span>
      </div>
    </div>
    
    <div class="timeline-item">
      <div class="timeline-icon">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <div class="timeline-content">
        <h3>MSc in Biochemistry</h3>
        <span class="timeline-date">2013 - 2015</span>
        <p>Explored porphyrin materials synthesis by ionic self-assembly.</p>
        <span class="timeline-location">University of Porto</span>
      </div>
    </div>
    
    <div class="timeline-item">
      <div class="timeline-icon">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <div class="timeline-content">
        <h3>BSc in Biochemistry</h3>
        <span class="timeline-date">2010 - 2013</span>
        <p>Studied effects of protein depletion in Drosophila wing disc development.</p>
        <span class="timeline-location">University of Porto</span>
      </div>
    </div>
    
    <div class="timeline-item">
      <div class="timeline-icon">
        <i class="fas fa-briefcase"></i>
      </div>
      <div class="timeline-content timeline-future">
        <h3>Your Company?</h3>
        <span class="timeline-date">2025 →</span>
        <p>I'm seeking opportunities in algorithm development, scientific software creation, and computational problem-solving.</p>
        <a href="{{ '/contact' | relative_url }}" class="timeline-cta">Let's Connect</a>
      </div>
    </div>
  </div>
</section>

<div class="section-divider">
  <div class="divider-line"></div>
  <div class="divider-icon"><i class="fas fa-comments"></i></div>
  <div class="divider-line"></div>
</div>

<div class="cta-section">
  <div class="cta-content">
    <h2>Ready to collaborate?</h2>
    <p>I'm currently available for new opportunities in Copenhagen or Remote positions.</p>
    <div class="cta-buttons">
      <a href="{{ '/contact' | relative_url }}" class="cta-button">Contact Me</a>
      <a href="{{ '/cv' | relative_url }}" class="cta-button-secondary">View My CV</a>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/home.js' | relative_url }}"></script>