---
layout: default
title: Projects
description: "Explore João Pedro Santos's projects including the Subcellular_Workflow MATLAB framework, Android development, and porphyrin materials research."
permalink: /projects/
---

<section id="all-projects" class="projects-section">
  <div class="projects-container">
    <!-- Project 1 - Subcellular_Workflow -->
    <div class="project-card">
      <div class="project-header">
        <div class="project-icon">
          <i class="fas fa-laptop-code"></i>
        </div>
        <div class="project-title-container">
          <div class="project-title-row">
            <h2 class="project-title">{{ site.data.featured-project.title }}</h2>
            <div class="project-title-links">
              {% for link in site.data.featured-project.links %}
              <a href="{{ link.url }}" target="_blank" rel="noopener noreferrer" class="button project-link" aria-label="{{ link.text }}">
                <i class="{{ link.icon }}"></i>
                <span class="project-link-text">{{ link.text }}</span>
              </a>
              {% endfor %}
            </div>
          </div>
          <p class="project-meta">PhD Project ({{ site.data.featured-project.timeframe }}) &rsaquo; MATLAB, Python, Git</p>
        </div>
      </div>
      
      <div class="project-content">
        <p>{{ site.data.featured-project.description }}</p>
        
        <div class="project-achievements">
          <h3><i class="fas fa-trophy"></i> Key Achievements</h3>
          <ul>
            {% for feature in site.data.featured-project.features %}
            <li>{{ feature }}</li>
            {% endfor %}
            <li>Developed tools for converting between SBtab format and other standard formats (SBML)</li>
            <li>Applied the workflow to analyze benchmark models in systems biology and neuroscience</li>
          </ul>
        </div>
        
        <div class="project-skills">
          <h3><i class="fas fa-tools"></i> Technologies</h3>
		  <div class="pills">
            <span>MATLAB</span>
            <span>SimBiology</span>
            <span>Optimization Toolbox</span>
		    <span>Python</span>
		    <span>COPASI</span>
		    <span>Git</span>
		    <span>SBML</span>
		    <span>SBtab</span>
          </div>
        </div>
        
      </div>
    </div>
    
    <!-- Project 2 - Chore Division Android App -->
    <div class="project-card">
      <div class="project-header">
        <div class="project-icon">
          <i class="fas fa-mobile-alt"></i>
        </div>
        <div class="project-title-container">
          <h2 class="project-title">Chore Division Android App</h2>
          <p class="project-meta">Personal Project (2025) &rsaquo; Kotlin, Android Studio</p>
        </div>
      </div>
      
      <div class="project-content">
        <p>Independently developed full-stack Android application from concept to Google Play deployment, managing the entire development lifecycle.</p>
        
        <div class="project-achievements">
          <h3><i class="fas fa-trophy"></i> Key Achievements</h3>
          <ul>
            <li>Built and shipped a complete Android app now in Play Store testing</li>
            <li>Implemented modern app architecture with Jetpack Compose and ViewModel-based architecture using Hilt</li>
            <li>Designed local data persistence with Room and background task management with WorkManager</li>
            <li>Integrated Firebase for analytics and notifications</li>
            <li>Set up solid Git workflows and documentation for future collaborators</li>
            <li>Used LLM-assisted programming to accelerate development without sacrificing code quality</li>
          </ul>
        </div>
        
        <div class="project-skills">
          <h3><i class="fas fa-tools"></i> Technologies</h3>
		  <div class="pills">
            <span>Kotlin</span>
            <span>Jetpack Compose</span>
            <span>Hilt</span>
            <span>Room</span>
            <span>WorkManager</span>
            <span>Firebase</span>
            <span>Play Console</span>
          </div>
        </div>
        
        <div class="project-image-container">
          <div class="phone-mockup">
            <div class="phone-screen">
              <div class="app-header"></div>
              <div class="app-content">
                <div class="app-item"></div>
                <div class="app-item"></div>
                <div class="app-item"></div>
              </div>
              <div class="app-footer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Project 3 - Porphyrin Materials Research -->
    <div class="project-card">
      <div class="project-header">
        <div class="project-icon">
          <i class="fas fa-flask"></i>
        </div>
        <div class="project-title-container">
          <div class="project-title-row">
            <h2 class="project-title">Porphyrin Materials Research</h2>
            <div class="project-title-links">
              <a href="https://doi.org/10.1016/j.tet.2016.09.030" target="_blank" rel="noopener noreferrer" class="button project-link" aria-label="Publication">
                <i class="fas fa-file-alt"></i>
                <span class="project-link-text">Publication</span>
              </a>
            </div>
          </div>
          <p class="project-meta">MSc Thesis & Research Scholarship (2013-2015)</p>
        </div>
      </div>
      
      <div class="project-content">
        <p>Research project focused on synthesizing and characterizing porphyrin nanomaterials via ionic self-assembly.</p>
        
        <div class="project-achievements">
          <h3><i class="fas fa-trophy"></i> Key Achievements</h3>
          <ul>
            <li>Performed synthesis, purification, and characterization of porphyrin nanomaterials</li>
            <li>Analyzed IR spectrograms for species concentrations</li>
            <li>Supervised two undergraduate students during their extracurricular internships</li>
            <li>Published in <a href="https://doi.org/10.1016/j.tet.2016.09.030" target="_blank" rel="noopener noreferrer"><em>Tetrahedron</em></a></li>
          </ul>
        </div>
        
        <div class="project-skills">
          <h3><i class="fas fa-tools"></i> Technologies/Skills</h3>
		  <div class="pills">
            <span>Organic Synthesis</span>
            <span>Spectroscopy</span>
            <span>Data Analysis</span>
		    <span>Chromatography</span>
          </div>
        </div>
        
        <div class="project-image-container">
          <div class="porphyrin-assembly" role="img" aria-label="Porphyrin units assembling into nanostructures">
            <svg class="porphyrin-assembly-svg" viewBox="0 0 480 240" aria-hidden="true">
              <title>Porphyrin self-assembly into nanostructures</title>
              <defs>
                <marker id="assembly-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="8" markerHeight="8" orient="auto">
                  <path class="assembly-arrowhead" d="M0 0 L8 4 L0 8 Z"></path>
                </marker>
                <g id="porphyrin-unit">
                  <circle class="porphyrin-ring" cx="0" cy="0" r="22"></circle>
                  <rect class="porphyrin-core" x="-12" y="-12" width="24" height="24" rx="4" ry="4" transform="rotate(45)"></rect>
                  <circle class="porphyrin-metal" cx="0" cy="0" r="3.6"></circle>
                  <circle class="porphyrin-node" cx="0" cy="-16" r="3.2"></circle>
                  <circle class="porphyrin-node" cx="16" cy="0" r="3.2"></circle>
                  <circle class="porphyrin-node" cx="0" cy="16" r="3.2"></circle>
                  <circle class="porphyrin-node" cx="-16" cy="0" r="3.2"></circle>
                  <line class="porphyrin-link" x1="-8" y1="-8" x2="8" y2="8"></line>
                  <line class="porphyrin-link" x1="-8" y1="8" x2="8" y2="-8"></line>
                </g>
              </defs>
              <circle class="cluster-ring" cx="340" cy="120" r="90"></circle>
              <circle class="cluster-ring inner" cx="340" cy="120" r="64"></circle>
              <path class="assembly-path path-a" d="M100 50 C 180 20, 250 40, 300 80" marker-end="url(#assembly-arrow)"></path>
              <path class="assembly-path path-b" d="M120 150 C 190 190, 260 180, 300 145" marker-end="url(#assembly-arrow)"></path>
              <path class="assembly-path path-c" d="M90 200 C 170 230, 240 210, 295 170" marker-end="url(#assembly-arrow)"></path>
              <circle class="assembly-ion ion-1" cx="165" cy="70" r="3.2"></circle>
              <circle class="assembly-ion ion-2" cx="220" cy="55" r="2.6"></circle>
              <circle class="assembly-ion ion-3" cx="185" cy="165" r="3"></circle>
              <circle class="assembly-ion ion-4" cx="240" cy="175" r="2.6"></circle>
              <circle class="assembly-ion ion-5" cx="170" cy="205" r="2.6"></circle>
              <use href="#porphyrin-unit" class="porphyrin-unit unit-a" transform="translate(70 60) scale(0.85)"></use>
              <use href="#porphyrin-unit" class="porphyrin-unit unit-b" transform="translate(135 120) scale(0.9)"></use>
              <use href="#porphyrin-unit" class="porphyrin-unit unit-c" transform="translate(90 190) scale(0.78)"></use>
              <g class="porphyrin-cluster">
                <use href="#porphyrin-unit" class="porphyrin-unit unit-d" transform="translate(300 70) scale(1)"></use>
                <use href="#porphyrin-unit" class="porphyrin-unit unit-e" transform="translate(360 120) scale(1)"></use>
                <use href="#porphyrin-unit" class="porphyrin-unit unit-f" transform="translate(300 170) scale(1)"></use>
                <use href="#porphyrin-unit" class="porphyrin-unit unit-g" transform="translate(260 120) scale(1)"></use>
                <use href="#porphyrin-unit" class="porphyrin-unit unit-h" transform="translate(330 120) scale(0.95)"></use>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" style="margin-bottom: 0;">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-rocket"></i></span> Future Directions</h2>
  <div class="grid">
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-brain"></i>
      </div>
      <h3>Computational Neuroscience Models</h3>
      <p>Expanding the Subcellular_Workflow to support multi-scale neural modeling, from molecular interactions to network activity.</p>
    </div>
    
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-robot"></i>
      </div>
      <h3>ML Algorithm Implementation</h3>
      <p>Implementing specialized machine learning algorithms for analyzing complex biological datasets and time series.</p>
    </div>
    
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-plug"></i>
      </div>
      <h3>API Development</h3>
      <p>Creating APIs and interfaces to connect various computational tools and facilitate data exchange between platforms.</p>
    </div>
  </div>
</section>








