// Typewriter Effect
document.addEventListener('DOMContentLoaded', function() {
  const phrases = [
    "PhD in Computational Neuroscience",
    "Scientific Software Developer",
    "Algorithm Implementation Specialist",
    "Mathematical Modeling Expert"
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typewriterElement = document.getElementById('typewriter-text');
  
  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      // Removing characters
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Adding characters
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }
    
    // Speed controls
    let typeSpeed = isDeleting ? 50 : 100;
    
    // If complete, start deleting after pause
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 1500; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      // Move to next phrase
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before starting new phrase
    }
    
    setTimeout(typeEffect, typeSpeed);
  }
  
  // Start typing effect
  if (typewriterElement) {
    setTimeout(typeEffect, 1000);
  }
   
  // Scroll Animations
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.expertise-card, .project-showcase, .timeline-item, .testimonial-content');
    
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
  const elementsToAnimate = document.querySelectorAll('.expertise-card, .project-showcase, .timeline-item, .testimonial-content');
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