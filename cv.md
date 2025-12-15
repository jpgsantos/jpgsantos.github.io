---
layout: default
title: CV
description: "Curriculum Vitae of João Pedro Santos - education, experience, skills, publications, and downloadable PDF resume."
---

<section class="cv-overview-section">
  <div class="cv-header-card">
    <div class="cv-header-content">
      <div class="cv-header-photo-container">
        <div class="cv-header-photo">
          <img src="{{ '/assets/images/Profile.jpg' | relative_url }}" alt="João Pedro Gomes dos Santos" loading="eager">
        </div>
        <a href="{{ '/assets/PDFs/Joao_Pedro_Santos_CV.pdf' | relative_url }}" class="button" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-download"></i> Download CV
        </a>
      </div>
      <div class="cv-header-info">
        <h2>João Pedro Gomes dos Santos</h2>
        <h3>Computational Neuroscience PhD | Scientific Software Developer</h3>
        
        <div class="cv-contact-grid">
          <div class="cv-contact-item">
            <i class="fas fa-envelope"></i>
            <span><a href="mailto:jpgs.12390@gmail.com">jpgs.12390@gmail.com</a></span>
          </div>
          <div class="cv-contact-item">
            <i class="fas fa-phone"></i>
            <span>+351 963264450</span>
          </div>
          <div class="cv-contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>Copenhagen, Denmark (Target) / Remote</span>
          </div>
          <div class="cv-contact-item">
            <i class="fas fa-flag-checkered"></i>
            <span>EU Citizen</span>
          </div>
          <div class="cv-contact-item">
            <i class="fab fa-linkedin"></i>
            <span><a href="https://linkedin.com/in/joaosantos1992" target="_blank" rel="noopener noreferrer">joaosantos1992</a></span>
          </div>
          <div class="cv-contact-item">
            <i class="fab fa-github"></i>
            <span><a href="https://github.com/jpgsantos" target="_blank" rel="noopener noreferrer">jpgsantos</a></span>
          </div>
          <div class="cv-contact-item">
            <i class="fas fa-language"></i>
            <span><strong>Languages:</strong> Portuguese (Native), English (C2)</span>
          </div>
          <div class="cv-contact-item">
            <i class="fas fa-calendar-check"></i>
            <span><strong>Availability:</strong> Immediate</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cv-main-section">
  <div class="cv-grid">
    <div class="cv-section">
      <div class="cv-section-header">
        <i class="fas fa-graduation-cap"></i>
        <h2>Education</h2>
      </div>
      
      <div class="cv-entry">
        <div class="cv-entry-header">
          <h3>PhD in Computational Neuroscience (GABBA Program)</h3>
          <div class="cv-date">Jan 2016 - Mar 2025</div>
        </div>
        <div class="cv-entry-subtitle">University of Porto / Karolinska Institutet</div>
        <div class="cv-entry-content">
          <p><strong>Thesis:</strong> A workflow for developing biochemical pathway models using ordinary differential equations</p>
          <p><strong>Supervisors:</strong> Prof. Jeanette Hellgren Kotaleski, Dr. Teresa Summavielle</p>
        </div>
      </div>
      
      <div class="cv-entry">
        <div class="cv-entry-header">
          <h3>MSc in Biochemistry</h3>
          <div class="cv-date">Sep 2013 - Sep 2015</div>
        </div>
        <div class="cv-entry-subtitle">University of Porto (FCUP, ICBAS)</div>
        <div class="cv-entry-content">
          <p><strong>Final Grade:</strong> 16/20</p>
          <p><strong>Thesis:</strong> Exploring the Boundaries of Porphyrin Materials Synthesis by Ionic Self-Assembly</p>
        </div>
      </div>
      
      <div class="cv-entry">
        <div class="cv-entry-header">
          <h3>BSc in Biochemistry</h3>
          <div class="cv-date">Sep 2010 - Jul 2013</div>
        </div>
        <div class="cv-entry-subtitle">University of Porto (FCUP, ICBAS)</div>
        <div class="cv-entry-content">
          <p><strong>Final Grade:</strong> 16/20</p>
        </div>
      </div>
    </div>
    
    <div class="cv-section">
      <div class="cv-section-header">
        <i class="fas fa-briefcase"></i>
        <h2>Experience</h2>
      </div>
      
      <div class="cv-entry">
        <div class="cv-entry-header">
          <h3>PhD Researcher (Computational Neuroscience)</h3>
          <div class="cv-date">Jan 2016 - Mar 2025</div>
        </div>
        <div class="cv-entry-subtitle">University of Porto / Karolinska Institutet / KTH Royal Institute of Technology / SciLifeLab</div>
        <div class="cv-entry-content">
          <p>Developed <strong>Subcellular_Workflow</strong>: a modular, FAIR-compliant MATLAB framework for ODE-based biochemical pathway modeling.</p>
          <ul>
            <li>Implemented algorithms from literature: parameter estimation, sensitivity analysis, profile likelihood analysis</li>
            <li>Engineered interfaces between MATLAB solvers and COPASI</li>
            <li>Applied the workflow to analyze benchmark models in neuroscience and systems biology</li>
            <li>Created comprehensive documentation and managed Git/GitHub collaboration</li>
            <li>Published results in a peer-reviewed article in <em>Neuroinformatics</em></li>
          </ul>
        </div>
      </div>
      
      <div class="cv-entry">
        <div class="cv-entry-header">
          <h3>Research Scholar</h3>
          <div class="cv-date">Apr 2015 - Dec 2015</div>
        </div>
        <div class="cv-entry-subtitle">UCIBIO @ REQUIMTE, University of Porto</div>
        <div class="cv-entry-content">
          <p>Conducted research on porphyrin nanomaterials via ionic self-assembly.</p>
          <ul>
            <li>Performed synthesis, purification, and characterization of materials</li>
            <li>Analyzed IR spectrograms for species concentrations</li>
            <li>Supervised two undergraduate students</li>
            <li>Contributed to a publication in <em>Tetrahedron</em></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-cogs"></i></span>Technical Skills</h2>
  {% include skills-grid.html %}
</section>

<section class="section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-file-alt"></i></span>Publications</h2>
  {% include publications.html %}
</section>

<section class="section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-project-diagram"></i></span>Key Projects</h2>
  
  <div class="grid">
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-laptop-code"></i>
      </div>
      <h3>Subcellular_Workflow</h3>
      <p>A modular, FAIR-compliant MATLAB framework for ODE biochemical pathway modeling, analysis, and parameterization.</p>
      <div class="project-mini-links">
        <a href="https://github.com/jpgsantos/Subcellular_Workflow" target="_blank" rel="noopener noreferrer" class="button">
        GitHub <i class="fab fa-github"></i>
        </a>
        <a href="https://subcellular-workflow.readthedocs.io/" target="_blank" rel="noopener noreferrer" class="button">
        Docs <i class="fas fa-book"></i>
        </a>
        <a href="https://github.com/jpgsantos/Subcellular_Workflow" target="_blank" rel="noopener noreferrer" class="button">
        Paper <i class="fas fa-file-alt"></i>
        </a>
      </div>
    </div>
    
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-mobile-alt"></i>
      </div>
        <h3>Chore Division Android App</h3>
        <p>Self-taught Kotlin project demonstrating rapid learning ability and adaptability to new technologies.</p>
    </div>
  </div>
  
  <div class="view-more-projects">
    <a href="{{ '/projects' | relative_url }}" class="view-more-link">
      View Detailed Projects <i class="fas fa-arrow-right"></i>
    </a>
  </div>
</section>