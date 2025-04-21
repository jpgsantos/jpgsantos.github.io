---
layout: default
title: Projects
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
          <a href="{{ link.url }}" target="_blank" class="project-button">
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
          <p class="project-meta">Personal Project (Oct 2024 - Mar 2025) • Kotlin, Android Studio</p>
        </div>
      </div>
      
      <div class="project-content">
        <p>A functional Android app for household chore division, built to demonstrate rapid learning ability and adaptability to new technologies.</p>
        
        <div class="project-achievements">
          <h3><i class="fas fa-trophy"></i> Key Achievements</h3>
          <ul>
            <li>Self-taught Kotlin basics and Android fundamentals from scratch</li>
            <li>Leveraged AI/LLM tools to accelerate learning and development</li>
            <li>Implemented core application logic and UI</li>
            <li>Demonstrated ability to quickly adapt to new programming languages and frameworks</li>
          </ul>
        </div>
        
        <div class="project-skills">
          <h3><i class="fas fa-tools"></i> Technologies</h3>
		  <div class="pills">
            <span>Kotlin</span>
            <span>Android Studio</span>
            <span>AI/LLM Tools</span>
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
            <li>Contributed to a publication in <em>Tetrahedron</em></li>
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
          <a href="https://doi.org/10.1016/j.tet.2016.09.030" target="_blank" class="project-button">
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

<section class="section">
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

<style>
/* Projects page styles */

/* Remove extra spacing, use CSS variables for section padding */
.projects-section {
  padding: var(--content-padding);
}

.future-projects {
  padding: var(--content-padding);
}

/* Project Cards */
.projects-container {
  display: flex;
  flex-direction: column;
}

.project-card {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: 0 10px 30px var(--shadow);
  transition: transform var(--transition), box-shadow var(--transition);
}

.project-header {
  display: flex;
  align-items: center;
  gap: 1.5em;
  padding: 2em;
  background-color: var(--primary-light);
  border-bottom: 1px solid var(--border-light);
}

.project-icon {
  width: 60px;
  height: 60px;
  background-color: var(--primary-color);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  border-radius: 12px;
  box-shadow: 0 5px 15px var(--shadow);
}

.project-title-container {
  flex: 1;
}

.project-title {
  margin: 0 0 0.2em 0;
  color: var(--primary-dark);
  font-size: 1.8em;
}

.project-meta {
  margin: 0;
  color: var(--text-light);
  font-style: italic;
}

.project-content {
  padding: 2em;
}

.project-content > p {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 1.5em;
  color: var(--text-dark);
}

.project-achievements {
  margin-bottom: 1.5em;
}

.project-achievements h3,
.project-skills h3 {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1em;
  color: var(--primary-color);
  font-size: 1.3em;
}

.project-achievements ul {
  padding-left: 1.5em;
}

.project-achievements li {
  margin-bottom: 0.7em;
  color: var(--text-dark);
}

.project-skills {
  margin-bottom: 1.5em;
}

.project-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  margin-top: 1.5em;
}

.project-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.7em 1.4em;
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 50px;
  font-size: 0.9em;
  font-weight: 500;
  transition: all var(--transition);
  box-shadow: 0 4px 8px var(--shadow);
}

.project-button:hover {
  background-color: var(--primary-dark);
  color: var(--white);
  transform: translateY(-3px);
  box-shadow: 0 8px 16px var(--shadow-strong);
  gap: 0.8em;
}

/* Project Images */
.project-image-container {
  margin-top: 2em;
  display: flex;
  justify-content: center;
}

.phone-mockup {
  width: 250px;
  height: 450px;
  background-color: #333;
  border-radius: 30px;
  padding: 10px;
  position: relative;
  box-shadow: 0 15px 30px var(--shadow-strong);
}

.phone-screen {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 60px;
  background-color: var(--primary-color);
}

.app-content {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.app-item {
  height: 80px;
  background-color: var(--primary-light);
  border-radius: 10px;
}

.app-footer {
  height: 50px;
  background-color: #f5f5f5;
}

.molecule-visualization {
  position: relative;
  width: 300px;
  height: 200px;
  margin: 0 auto;
}

.atom {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

.atom1 {
  top: 50px;
  left: 50px;
  animation: float 4s infinite ease-in-out;
}

.atom2 {
  top: 30px;
  left: 150px;
  animation: float 5s infinite ease-in-out;
}

.atom3 {
  top: 120px;
  left: 180px;
  animation: float 6s infinite ease-in-out;
}

.atom4 {
  top: 140px;
  left: 80px;
  animation: float 4.5s infinite ease-in-out;
}

.bond {
  position: absolute;
  height: 8px;
  background-color: var(--text-light);
  transform-origin: left center;
}

.bond1 {
  width: 120px;
  top: 70px;
  left: 70px;
  transform: rotate(0deg);
}

.bond2 {
  width: 100px;
  top: 50px;
  left: 170px;
  transform: rotate(90deg);
}

.bond3 {
  width: 150px;
  top: 140px;
  left: 100px;
  transform: rotate(-30deg);
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

/* Responsive styles */
@media (max-width: 992px) {
  .project-header {
    padding: 1.5em;
  }
  
  .project-content {
    padding: 1.5em;
  }
}

@media (max-width: 768px) {
  .project-title {
    font-size: 1.5em;
  }
  
  .project-links {
    flex-direction: column;
  }
  
  .project-button {
    width: 100%;
    justify-content: center;
  }
}
</style>