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

<section class="cv-download-section">
  <div class="cv-showcase">
    <div class="cv-content">
      <h2>Get My CV</h2>
      <p>Download my CV to learn more about my experience, education, and skills.</p>
      <a href="{{ '/assets/PDFs/Joao_Pedro_Santos_CV.pdf' | relative_url }}" class="cv-download-button" target="_blank">
        <i class="fas fa-download"></i> Download CV
      </a>
    </div>
    <div class="cv-image">
      <div class="cv-document">
        <div class="cv-header"></div>
        <div class="cv-line"></div>
        <div class="cv-content-lines">
          <div class="cv-line-short"></div>
          <div class="cv-line-medium"></div>
          <div class="cv-line-short"></div>
          <div class="cv-line-long"></div>
          <div class="cv-line-medium"></div>
          <div class="cv-line-short"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
/* Added spacing to replace dividers */
.contact-options-section {
  padding: 2em 0;
  margin-top: 3em;
}

.professional-info-section {
  padding: 2em 0;
  margin-top: 4em;
}

.cv-download-section {
  padding: 2em 4em;
  margin-top: 4em;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2em;
  padding: 2em 4em;
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
  padding: 2em 4em;
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

.cv-showcase {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  display: flex;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--shadow);
}

.cv-content {
  flex: 1;
  padding: 3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cv-content h2 {
  margin-bottom: 0.5em;
  color: var(--primary-color);
  font-size: 2em;
}

.cv-content p {
  margin-bottom: 1.5em;
  color: var(--text-light);
  font-size: 1.1em;
}

.cv-download-button {
  display: inline-flex;
  align-items: center;
  gap: 0.8em;
  padding: 0.8em 1.5em;
  background-color: var(--primary-color);
  color: var(--white);
  border-radius: 50px;
  font-weight: 600;
  transition: all var(--transition);
  box-shadow: 0 4px 8px var(--shadow);
  align-self: flex-start;
}

.cv-download-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 8px 16px var(--shadow-strong);
}

.cv-image {
  flex: 1;
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3em;
}

.cv-document {
  width: 250px;
  height: 350px;
  background-color: var(--white);
  border-radius: 5px;
  box-shadow: 0 10px 20px var(--shadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  transform: rotate(3deg);
}

.cv-header {
  height: 30px;
  background-color: var(--primary-light);
  border-radius: 3px;
}

.cv-line {
  height: 10px;
  background-color: var(--primary-light);
  border-radius: 3px;
  width: 60%;
}

.cv-content-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.cv-line-short {
  height: 8px;
  background-color: var(--border-light);
  border-radius: 3px;
  width: 40%;
}

.cv-line-medium {
  height: 8px;
  background-color: var(--border-light);
  border-radius: 3px;
  width: 70%;
}

.cv-line-long {
  height: 8px;
  background-color: var(--border-light);
  border-radius: 3px;
  width: 90%;
}

/* Add spacing to CTA section */
.cta-section {
  margin-top: 4em;
  margin-bottom: 2em;
}

/* Responsive styles */
@media (max-width: 992px) {
  .contact-grid,
  .info-grid {
    padding: 2em;
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
    padding: 2em;
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

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Animation for cards on scroll
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.contact-card, .info-card, .cv-showcase');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // If element is in viewport
      if (elementPosition < windowHeight * 0.85) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Set initial styles for animation
  const elementsToAnimate = document.querySelectorAll('.contact-card, .info-card, .cv-showcase');
  elementsToAnimate.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Trigger once on load
  animateOnScroll();
});
</script>