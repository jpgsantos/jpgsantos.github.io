---
layout: default
title: Contact
---

<section class="section">
  <h2 class="section-heading"><span class="heading-icon"><i class="fas fa-paper-plane"></i></span> Connect With Me</h2>
  
  <div class="grid">
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-envelope"></i>
      </div>
      <h3>Email</h3>
      <p>jpgs.12390@gmail.com</p>
      <a href="mailto:jpgs.12390@gmail.com" class="contact-button">
        Send Email <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    <div class="card">
      <div class="card-icon">
        <i class="fas fa-phone"></i>
      </div>
      <h3>Phone</h3>
      <p>+351 963264450</p>
      <a href="tel:+351963264450" class="contact-button">
        Call Me <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    <div class="card">
      <div class="card-icon">
        <i class="fab fa-linkedin"></i>
      </div>
      <h3>LinkedIn</h3>
      <p>Connect professionally</p>
      <a href="https://linkedin.com/in/joaosantos1992" target="_blank" class="contact-button">
        Visit Profile <i class="fas fa-arrow-right"></i>
      </a>
    </div>
    
    <div class="card">
      <div class="card-icon">
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

<style>
/* Added spacing to replace dividers */

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



/* Responsive styles */
@media (max-width: 992px) {
  .contact-grid,
}

@media (max-width: 768px) {
  
  .contact-grid{
    grid-template-columns: 1fr;
  }
}
</style>