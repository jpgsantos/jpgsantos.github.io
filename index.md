---
layout: default
title: Home
---

<div class="hero-section">
  <div class="hero-background"></div>
  <div class="hero-content">
    <div class="hero-text">
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
      <div class="hero-image-border enlarged">
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
      <div class="workflow-diagram">
        <div class="diagram-node start">
          <i class="fas fa-play"></i>
          <span>Start</span>
        </div>
        <div class="diagram-arrow"></div>
        <div class="diagram-node">
          <i class="fas fa-cogs"></i>
          <span>Model Setup</span>
        </div>
        <div class="diagram-arrow"></div>
        <div class="diagram-node">
          <i class="fas fa-chart-line"></i>
          <span>Simulation</span>
        </div>
        <div class="diagram-arrow"></div>
        <div class="diagram-node">
          <i class="fas fa-sliders-h"></i>
          <span>Parameter Estimation</span>
        </div>
        <div class="diagram-arrow"></div>
        <div class="diagram-node">
          <i class="fas fa-search"></i>
          <span>Sensitivity Analysis</span>
        </div>
        <div class="diagram-arrow"></div>
        <div class="diagram-node end">
          <i class="fas fa-check-circle"></i>
          <span>Results</span>
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
  
  <div class="vertical-timeline">
    <div class="timeline-entry">
      <div class="timeline-dot">
        <i class="fas fa-briefcase"></i>
      </div>
      <div class="timeline-card future-card">
        <div class="timeline-period">2025 →</div>
        <h3>Your Company?</h3>
        <div class="timeline-location">Copenhagen, Denmark / Remote</div>
        <div class="timeline-details">
          <p>I'm seeking opportunities in algorithm development, scientific software creation, and computational problem-solving.</p>
          <a href="{{ '/contact' | relative_url }}" class="timeline-cta">Let's Connect</a>
        </div>
      </div>
    </div>
    
    <div class="timeline-entry">
      <div class="timeline-dot">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <div class="timeline-card">
        <div class="timeline-period">2016 - 2025</div>
        <h3>PhD in Computational Neuroscience</h3>
        <div class="timeline-location">University of Porto / Karolinska Institutet</div>
        <div class="timeline-details">
          <p>Developed the Subcellular_Workflow framework for ODE-based biochemical pathway modeling.</p>
        </div>
      </div>
    </div>
    
    <div class="timeline-entry">
      <div class="timeline-dot">
        <i class="fas fa-flask"></i>
      </div>
      <div class="timeline-card">
        <div class="timeline-period">2015</div>
        <h3>Research Scholar</h3>
        <div class="timeline-location">UCIBIO @ REQUIMTE, University of Porto</div>
        <div class="timeline-details">
          <p>Conducted research on porphyrin nanomaterials via ionic self-assembly.</p>
        </div>
      </div>
    </div>
    
    <div class="timeline-entry">
      <div class="timeline-dot">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <div class="timeline-card">
        <div class="timeline-period">2013 - 2015</div>
        <h3>MSc in Biochemistry</h3>
        <div class="timeline-location">University of Porto</div>
        <div class="timeline-details">
          <p>Explored porphyrin materials synthesis by ionic self-assembly.</p>
        </div>
      </div>
    </div>
    
    <div class="timeline-entry">
      <div class="timeline-dot">
        <i class="fas fa-graduation-cap"></i>
      </div>
      <div class="timeline-card">
        <div class="timeline-period">2010 - 2013</div>
        <h3>BSc in Biochemistry</h3>
        <div class="timeline-location">University of Porto</div>
        <div class="timeline-details">
          <p>Studied effects of protein depletion in Drosophila wing disc development.</p>
        </div>
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

<style>
/* Enhanced profile picture */
.hero-image-border.enlarged {
  width: 300px;
  height: 300px;
}

/* Workflow Diagram Styles */
.workflow-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 2em;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 5px 15px var(--shadow);
}

.diagram-node {
  width: 160px;
  padding: 15px;
  background-color: var(--primary-light);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  transition: all var(--transition);
}

.diagram-node:hover {
  transform: scale(1.05);
  background-color: var(--primary-color);
  color: var(--white);
}

.diagram-node i {
  font-size: 1.5em;
  color: var(--primary-color);
}

.diagram-node:hover i {
  color: var(--white);
}

.diagram-node span {
  font-weight: 500;
}

.diagram-arrow {
  width: 30px;
  height: 30px;
  position: relative;
}

.diagram-arrow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  width: 2px;
  background-color: var(--primary-color);
}

.diagram-arrow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 10px solid var(--primary-color);
}

.diagram-node.start {
  background-color: var(--primary-color);
  color: var(--white);
}

.diagram-node.start i {
  color: var(--white);
}

.diagram-node.end {
  background-color: var(--primary-dark);
  color: var(--white);
}

.diagram-node.end i {
  color: var(--white);
}

/* Vertical Timeline Styles */
.vertical-timeline {
  max-width: 800px;
  margin: 3em auto 0;
  position: relative;
  padding: 0 2em;
}

.vertical-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 45px;
  width: 4px;
  background-color: var(--timeline-color);
}

.timeline-entry {
  margin-bottom: 3em;
  position: relative;
  display: flex;
  align-items: flex-start;
}

.timeline-entry:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  width: 50px;
  height: 50px;
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  position: absolute;
  left: 22px;
  top: 20px;
  transform: translateX(-50%);
  z-index: 1;
  box-shadow: 0 0 0 5px var(--white), 0 5px 15px var(--shadow);
}

.timeline-card {
  background-color: var(--white);
  border-radius: var(--border-radius);
  padding: 1.5em;
  margin-left: 70px;
  width: calc(100% - 70px);
  box-shadow: 0 10px 30px var(--shadow);
  position: relative;
}

.timeline-card.future-card {
  background-color: var(--accent-light);
  border: 2px dashed var(--primary-color);
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 30px;
  left: -15px;
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 15px solid var(--white);
}

.timeline-card.future-card::before {
  border-right-color: var(--accent-light);
}

.timeline-period {
  display: inline-block;
  background-color: var(--primary-light);
  color: var(--primary-dark);
  padding: 0.4em 1em;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
  margin-bottom: 0.8em;
}

.timeline-card h3 {
  font-size: 1.3em;
  margin-bottom: 0.5em;
  color: var(--primary-color);
}

.timeline-location {
  font-style: italic;
  color: var(--text-light);
  margin-bottom: 0.8em;
  font-size: 0.9em;
}

.timeline-details {
  line-height: 1.6;
}

.timeline-cta {
  display: inline-block;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.5em 1.2em;
  border-radius: 50px;
  font-size: 0.9em;
  font-weight: 500;
  margin-top: 1em;
  transition: all var(--transition);
}

.timeline-cta:hover {
  background-color: var(--primary-dark);
  color: var(--white);
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .hero-content {
    flex-direction: column-reverse;
    text-align: center;
    padding: 3em 2em;
  }
  
  .hero-text {
    max-width: 100%;
    margin-bottom: 2em;
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
  
  .vertical-timeline {
    padding: 0 1em;
  }
  
  .timeline-dot {
    width: 40px;
    height: 40px;
    font-size: 1em;
    left: 20px;
  }
  
  .timeline-card {
    margin-left: 60px;
    width: calc(100% - 60px);
    padding: 1em;
  }
  
  .timeline-card h3 {
    font-size: 1.2em;
  }
}
</style>

<script src="{{ '/assets/js/home.js' | relative_url }}"></script>