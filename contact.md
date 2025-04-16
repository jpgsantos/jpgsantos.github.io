---
layout: default
title: Contact
---

<section class="contact-options-section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-paper-plane"></i></span> Connect With Me</h2>
  
  <div class="contact-grid">
    <div class="contact-card">
      <div class="contact-icon">
        <i class="fas fa-envelope"></i>
      </div>
      <h3>Email</h3>
      <p><a href="mailto:jpgs.12390@gmail.com">jpgs.12390@gmail.com</a></p>
      <a href="mailto:jpgs.12390@gmail.com" class="contact-button">
        Send Email <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    <div class="contact-card">
      <div class="contact-icon">
        <i class="fas fa-phone"></i>
      </div>
      <h3>Phone</h3>
      <p>+351 963264450</p>
      <a href="tel:+351963264450" class="contact-button">
        Call Me <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    <div class="contact-card">
      <div class="contact-icon">
        <i class="fab fa-linkedin"></i>
      </div>
      <h3>LinkedIn</h3>
      <p>Connect professionally</p>
      <a href="https://linkedin.com/in/joaosantos1992" target="_blank" class="contact-button">
        Visit Profile <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    <div class="contact-card">
      <div class="contact-icon">
        <i class="fab fa-github"></i>
      </div>
      <h3>GitHub</h3>
      <p>Check out my code</p>
      <a href="https://github.com/jpgsantos" target="_blank" class="contact-button">
        View Projects <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  </div>
</section>

<section class="professional-info-section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-info-circle"></i></span> Professional Information</h2>
  
  <div class="info-grid">
    <div class="info-card">
      <div class="info-icon">
        <i class="fas fa-bullseye"></i>
      </div>
      <h3>Target Roles</h3>
      <ul class="info-list">
        <li><i class="fas fa-check"></i> Research Engineer</li>
        <li><i class="fas fa-check"></i> Scientific Software Developer</li>
        <li><i class="fas fa-check"></i> ML Engineer (Algorithm Focus)</li>
        <li><i class="fas fa-check"></i> Computational Scientist</li>
        <li><i class="fas fa-check"></i> Modeling Scientist (Tooling/Algorithm Focus)</li>
      </ul>
    </div>
    
    <div class="info-card">
      <div class="info-icon">
        <i class="fas fa-industry"></i>
      </div>
      <h3>Target Industries</h3>
      <ul class="info-list">
        <li><i class="fas fa-check"></i> Neurotechnology startups</li>
        <li><i class="fas fa-check"></i> Scientific Computing Services</li>
        <li><i class="fas fa-check"></i> AI/ML research-focused companies</li>
        <li><i class="fas fa-check"></i> Innovative computational sectors</li>
      </ul>
    </div>
    
    <div class="info-card">
      <div class="info-icon">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <h3>Key Information</h3>
      <ul class="info-list">
        <li><i class="fas fa-check"></i> <strong>Availability:</strong> Immediate start</li>
        <li><i class="fas fa-check"></i> <strong>Work Authorization:</strong> EU Citizen (Full EU rights)</li>
        <li><i class="fas fa-check"></i> <strong>Target Location:</strong> Copenhagen / Remote</li>
        <li><i class="fas fa-check"></i> <strong>Languages:</strong> Portuguese (Native), English (C2)</li>
      </ul>
    </div>
    
    <div class="info-card">
      <div class="info-icon">
        <i class="fas fa-code"></i>
      </div>
      <h3>Technical Skills</h3>
      <div class="skill-tags">
        <span class="skill-tag">MATLAB</span>
        <span class="skill-tag">Python</span>
        <span class="skill-tag">Kotlin</span>
        <span class="skill-tag">Git</span>
        <span class="skill-tag">ODE Modeling</span>
        <span class="skill-tag">Parameter Estimation</span>
        <span class="skill-tag">Sensitivity Analysis</span>
        <span class="skill-tag">FAIR Principles</span>
      </div>
    </div>
  </div>
</section>

<style>
/* Added spacing to replace dividers */

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2em;
}

.contact-card {
  background-color: var(--white);
  border-radius: var(--border-radius);
  padding: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 5px 15px var(--shadow);
  transition: transform var(--transition), box-shadow var(--transition);
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px var(--shadow-strong);
}

.contact-icon {
  font-size: 2.5em;
  color: var(--primary-color);
  margin-bottom: 0.8em;
}

.contact-card h3 {
  margin-bottom: 0.5em;
  color: var(--primary-color);
}

.contact-card p {
  margin-bottom: 1.5em;
  color: var(--text-light);
}

.contact-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.6em 1.2em;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: 50px;
  font-weight: 500;
  transition: all var(--transition);
  margin-top: auto;
}

.contact-button:hover {
  background-color: var(--primary-color);
  color: var(--white);
  gap: 0.8em;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2em;
}

.info-card {
  background-color: var(--white);
  border-radius: var(--border-radius);
  padding: 2em;
  box-shadow: 0 5px 15px var(--shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-icon {
  font-size: 2em;
  color: var(--primary-color);
  margin-bottom: 0.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background-color: var(--primary-light);
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
}

.info-card h3 {
  margin-bottom: 1em;
  color: var(--primary-color);
  text-align: center;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  margin-bottom: 0.8em;
  display: flex;
  align-items: center;
  gap: 0.8em;
}

.info-list li i {
  color: var(--primary-color);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}

/* Responsive styles */
@media (max-width: 992px) {
  .contact-grid,
  .info-grid {
  }
  
  .cv-showcase {
    flex-direction: column;
  }
  
  .cv-image {
    padding: 2em;
  }
  
  .cv-document {
    transform: rotate(0);
  }
  
  .cv-download-section {
  }
}

@media (max-width: 768px) {
  .contact-hero {
    min-height: 300px;
  }
  
  .contact-grid,
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-illustration {
    width: 150px;
    height: 150px;
    font-size: 4em;
  }
}
</style>