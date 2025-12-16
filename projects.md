---
layout: default
title: Projects
description: "Explore João Pedro Santos's projects including the Subcellular_Workflow MATLAB framework, Android development, and porphyrin materials research."
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
          <h2 class="project-title">{{ site.data.featured-project.title }}</h2>
          <p class="project-meta">PhD Project ({{ site.data.featured-project.timeframe }}) • MATLAB, Python, Git</p>
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
        
        <div class="project-links">
          {% for link in site.data.featured-project.links %}
          <a href="{{ link.url }}" target="_blank" rel="noopener noreferrer" class="button">
            <i class="{{ link.icon }}"></i> {{ link.text }}
          </a>
          {% endfor %}
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
          <p class="project-meta">Personal Project (2025) • Kotlin, Android Studio</p>
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
          <h2 class="project-title">Porphyrin Materials Research</h2>
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
        
        <div class="project-links">
          <a href="https://doi.org/10.1016/j.tet.2016.09.030" target="_blank" rel="noopener noreferrer" class="button">
            <i class="fas fa-file-alt"></i> Publication
          </a>
        </div>
        
        <div class="project-image-container">
          <div class="molecule-visualization">
            <div class="atom atom1"></div>
            <div class="atom atom2"></div>
            <div class="atom atom3"></div>
            <div class="atom atom4"></div>
            <div class="bond bond1"></div>
            <div class="bond bond2"></div>
            <div class="bond bond3"></div>
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