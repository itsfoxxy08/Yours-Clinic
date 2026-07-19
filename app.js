// App logic for Yours Clinic

// ----------------------------------------------------
// 1. Disease Database & Modal Interactions
// ----------------------------------------------------
const diseasesData = {
  flu: {
    title: 'Influenza & Respiratory Infections',
    category: 'respiratory',
    icon: '🌡️',
    short: 'Common viral infections of the nose, throat, and lungs, including cold, flu, and bronchitis.',
    symptoms: [
      'Fever or chills, cough, sore throat',
      'Runny or stuffy nose',
      'Muscle or body aches',
      'Headache and fatigue'
    ],
    whenToSee: 'Seek care if you experience shortness of breath, chest pain, persistent high fever, or symptoms that improve then worsen.',
    prevention: [
      'Get an annual flu vaccine',
      'Wash hands frequently with soap and water',
      'Avoid close contact with sick individuals',
      'Cover your mouth and nose when coughing'
    ]
  },
  diabetes: {
    title: 'Type 2 Diabetes',
    category: 'chronic',
    icon: '🩸',
    short: 'A chronic condition that affects the way the body processes blood sugar (glucose).',
    symptoms: [
      'Increased thirst and frequent urination',
      'Increased hunger and unexplained weight loss',
      'Fatigue and blurry vision',
      'Slow-healing sores or frequent infections'
    ],
    whenToSee: 'Schedule an evaluation if you notice persistent symptoms or have a family history and want screening.',
    prevention: [
      'Maintain a healthy weight',
      'Eat a balanced diet rich in fiber and whole grains',
      'Engage in regular physical activity (150 mins/week)',
      'Regular blood glucose screenings'
    ]
  },
  hypertension: {
    title: 'Hypertension (High Blood Pressure)',
    category: 'chronic',
    icon: '❤️',
    short: 'A common condition in which the long-term force of the blood against your artery walls is high enough to cause health issues.',
    symptoms: [
      'Often has no symptoms (the "silent killer")',
      'Severe headaches (in extreme cases)',
      'Shortness of breath or nosebleeds',
      'Dizziness or chest pain'
    ],
    whenToSee: 'Have your blood pressure checked regularly. Consult immediately if experiencing severe chest pain or pressure.',
    prevention: [
      'Reduce sodium intake in your diet',
      'Exercise regularly and manage stress levels',
      'Limit alcohol consumption and avoid smoking',
      'Monitor blood pressure at home'
    ]
  },
  gerd: {
    title: 'Acid Reflux & GERD',
    category: 'digestive',
    icon: '🍕',
    short: 'A digestive disorder that occurs when acidic stomach juices or food and fluids back up from the stomach into the esophagus.',
    symptoms: [
      'A burning sensation in your chest (heartburn), usually after eating',
      'Chest pain or difficulty swallowing',
      'Regurgitation of food or sour liquid',
      'Sensation of a lump in your throat'
    ],
    whenToSee: 'Consult if you take over-the-counter heartburn medications more than twice a week, or if symptoms interfere with sleep.',
    prevention: [
      'Avoid lying down immediately after eating (wait 3 hours)',
      'Eat smaller, more frequent meals',
      'Avoid trigger foods (fatty, spicy, caffeine, chocolate)',
      'Maintain a healthy weight'
    ]
  },
  dermatitis: {
    title: 'Eczema & Dermatitis',
    category: 'general',
    icon: '✨',
    short: 'An inflammatory skin condition that causes dry, red, itchy, and irritated patches of skin.',
    symptoms: [
      'Dry, sensitive skin',
      'Intense itching, which may be worse at night',
      'Red to brownish-gray patches',
      'Small, raised bumps that may leak fluid when scratched'
    ],
    whenToSee: 'See a doctor if the skin is painful, looks infected (pus, red streaks), or is keeping you awake.',
    prevention: [
      'Moisturize your skin at least twice a day',
      'Identify and avoid triggers (harsh soaps, sweat, stress)',
      'Take shorter, lukewarm baths or showers',
      'Use gentle, fragrance-free skin products'
    ]
  },
  anxiety: {
    title: 'Anxiety & Mild Depression',
    category: 'general',
    icon: '🧠',
    short: 'Common mental health conditions characterized by persistent feelings of worry, dread, or low mood.',
    symptoms: [
      'Feeling nervous, restless, or tense',
      'Difficulty concentrating or sleeping',
      'Persistent sad, anxious, or "empty" mood',
      'Loss of interest in hobbies or activities'
    ],
    whenToSee: 'Reach out if feelings of sadness or anxiety interfere with daily life, work, or relationships for more than two weeks.',
    prevention: [
      'Stay physically active and connect with loved ones',
      'Practice mindfulness, meditation, or breathing exercises',
      'Maintain a regular sleep schedule',
      'Seek professional counseling early'
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.textContent = '☰';
      });
    });
  }

  // Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Active Link on Scroll
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Render Disease Cards
  renderDiseaseCards(diseasesData);

  // Setup Disease Card Filtering & Searching
  setupDiseaseFilters();

  // Setup Modal Actions
  setupModal();

  // Setup Triage Flow (Treatment Now)
  setupTriageFlow();

  // Setup Booking Interactive Logic
  setupBookingForm();

  // Scroll Reveal Animations
  setupScrollReveal();
});

// Render Disease Cards Function
function renderDiseaseCards(data) {
  const grid = document.getElementById('disease-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  Object.keys(data).forEach(key => {
    const item = data[key];
    const card = document.createElement('div');
    card.className = 'disease-card';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-key', key);
    
    card.innerHTML = `
      <div class="disease-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.short}</p>
      <div class="disease-learn-more">
        Learn symptoms & care <span>→</span>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// Search and Tag Filter Functionality
function setupDiseaseFilters() {
  const searchInput = document.getElementById('disease-search');
  const tagBtns = document.querySelectorAll('.tag-btn');
  
  function filterItems() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeTag = document.querySelector('.tag-btn.active').getAttribute('data-filter');
    const cards = document.querySelectorAll('.disease-card');

    cards.forEach(card => {
      const key = card.getAttribute('data-key');
      const item = diseasesData[key];
      const title = item.title.toLowerCase();
      const desc = item.short.toLowerCase();
      const cat = item.category;

      const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
      const matchesTag = activeTag === 'all' || cat === activeTag;

      if (matchesSearch && matchesTag) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterItems);
  }

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems();
    });
  });
}

// Modal System
function setupModal() {
  const modal = document.getElementById('disease-modal');
  const closeBtn = document.getElementById('modal-close');
  const overlay = document.getElementById('modal-overlay');
  
  if (!modal) return;

  // Open modal on card click
  document.getElementById('disease-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.disease-card');
    if (!card) return;

    const key = card.getAttribute('data-key');
    const item = diseasesData[key];

    if (item) {
      document.getElementById('modal-title').textContent = item.title;
      document.getElementById('modal-desc').textContent = item.short;
      
      const symptomsList = document.getElementById('modal-symptoms');
      symptomsList.innerHTML = item.symptoms.map(s => `<li>${s}</li>`).join('');
      
      document.getElementById('modal-whentosee').textContent = item.whenToSee;
      
      const preventionList = document.getElementById('modal-prevention');
      preventionList.innerHTML = item.prevention.map(p => `<li>${p}</li>`).join('');

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ----------------------------------------------------
// 2. Interactive Triage Flow (Treatment Now)
// ----------------------------------------------------
function setupTriageFlow() {
  let currentStep = 1;
  const totalSteps = 3;
  const triageBar = document.getElementById('triage-bar');
  const prevBtn = document.getElementById('triage-prev');
  const nextBtn = document.getElementById('triage-next');
  
  const stepContainers = document.querySelectorAll('.triage-step');
  const options = document.querySelectorAll('.triage-option-card');
  const symptomsTags = document.querySelectorAll('.symptom-tag');

  let selectedConcern = '';
  let selectedSeverity = '';
  let selectedSymptoms = [];

  // Toggle single options (Concern & Severity)
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const type = opt.getAttribute('data-type');
      const val = opt.getAttribute('data-value');
      
      // Clear siblings
      const siblings = document.querySelectorAll(`.triage-option-card[data-type="${type}"]`);
      siblings.forEach(s => s.classList.remove('selected'));
      
      opt.classList.add('selected');
      
      if (type === 'concern') {
        selectedConcern = val;
      } else if (type === 'severity') {
        selectedSeverity = val;
      }
      
      validateStep();
    });
  });

  // Toggle multi-select tags (Symptoms)
  symptomsTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
      const val = tag.getAttribute('data-value');
      
      if (tag.classList.contains('selected')) {
        selectedSymptoms.push(val);
      } else {
        selectedSymptoms = selectedSymptoms.filter(s => s !== val);
      }
      validateStep();
    });
  });

  function validateStep() {
    let isValid = false;
    if (currentStep === 1 && selectedConcern) isValid = true;
    if (currentStep === 2 && selectedSeverity) isValid = true;
    if (currentStep === 3 && selectedSymptoms.length > 0) isValid = true;
    
    if (nextBtn) {
      nextBtn.disabled = !isValid;
    }
  }

  function updateTriageView() {
    stepContainers.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    if (triageBar) {
      triageBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    }

    if (prevBtn) {
      prevBtn.style.visibility = (currentStep === 1 || currentStep > totalSteps) ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      if (currentStep === totalSteps) {
        nextBtn.textContent = 'Analyze Symptoms';
      } else {
        nextBtn.textContent = 'Continue';
      }
      
      if (currentStep > totalSteps) {
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'none';
      } else {
        nextBtn.style.display = 'block';
        prevBtn.style.display = 'block';
      }
    }

    validateStep();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateTriageView();
      } else if (currentStep === totalSteps) {
        currentStep++; // Show result page
        showTriageResult();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateTriageView();
      }
    });
  }

  function showTriageResult() {
    const resultStep = document.getElementById('triage-step-result');
    const resultBadge = document.getElementById('result-badge');
    const resultTitle = document.getElementById('result-title');
    const resultText = document.getElementById('result-text');
    const resultCta = document.getElementById('result-cta-sec');
    
    if (!resultStep || !resultBadge) return;
    
    // Hide other steps
    stepContainers.forEach(step => step.classList.remove('active'));
    resultStep.classList.add('active');
    
    if (triageBar) triageBar.style.width = '100%';
    if (nextBtn) nextBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';

    // Decision Logic
    if (selectedSeverity === 'high') {
      resultBadge.className = 'result-badge high';
      resultBadge.innerHTML = '🚨 Urgent Care Recommended';
      resultTitle.textContent = 'Please seek immediate medical evaluation';
      resultText.innerHTML = `Based on your severe symptoms, we recommend consulting a physician immediately or visiting the nearest urgent care center. <br><br><strong>Reported Concern:</strong> ${selectedConcern.replace('-', ' ')}<br><strong>Symptoms:</strong> ${selectedSymptoms.join(', ')}`;
      resultCta.innerHTML = `
        <a href="tel:+18005550199" class="btn btn-primary">Call Urgent Line</a>
        <a href="#book" class="btn btn-secondary" onclick="resetTriage()">Book Video Consult</a>
      `;
    } else if (selectedSeverity === 'medium') {
      resultBadge.className = 'result-badge medium';
      resultBadge.innerHTML = '⚠️ Consultation Advised';
      resultTitle.textContent = 'Schedule an appointment soon';
      resultText.innerHTML = `Your symptoms warrant medical professional evaluation to prevent worsening. We advise booking a clinic visit or teleconsultation within the next 24-48 hours. <br><br><strong>Symptoms:</strong> ${selectedSymptoms.join(', ')}`;
      resultCta.innerHTML = `
        <a href="#book" class="btn btn-primary" onclick="resetTriage()">Book Appointment</a>
        <a href="#diseases" class="btn btn-secondary" onclick="resetTriage()">Read Care Guide</a>
      `;
    } else {
      resultBadge.className = 'result-badge low';
      resultBadge.innerHTML = '✅ Mild Symptoms Care';
      resultTitle.textContent = 'Home Rest & Self-Care';
      resultText.innerHTML = `Your symptoms appear mild. Standard rest, hydration, and over-the-counter home care should help. If symptoms persist beyond 3 days, please schedule a review.<br><br><strong>Symptoms:</strong> ${selectedSymptoms.join(', ')}`;
      resultCta.innerHTML = `
        <a href="#diseases" class="btn btn-primary" onclick="resetTriage()">Self-Care Guidelines</a>
        <a href="#book" class="btn btn-secondary" onclick="resetTriage()">Book Routine Checkup</a>
      `;
    }
  }

  // Reset function globally accessible
  window.resetTriage = function() {
    currentStep = 1;
    selectedConcern = '';
    selectedSeverity = '';
    selectedSymptoms = [];
    
    options.forEach(o => o.classList.remove('selected'));
    symptomsTags.forEach(s => s.classList.remove('selected'));
    
    const resultStep = document.getElementById('triage-step-result');
    if (resultStep) resultStep.classList.remove('active');
    
    updateTriageView();
  };

  updateTriageView();
}

// ----------------------------------------------------
// 3. Appointment Scheduling & Dynamic Form
// ----------------------------------------------------
function setupBookingForm() {
  const dateInput = document.getElementById('book-date');
  const slotsContainer = document.getElementById('time-slots-grid');
  const appointmentForm = document.getElementById('appointment-form');
  const successContainer = document.getElementById('booking-success');
  const selectedSlotInput = document.getElementById('selected-slot');
  
  if (!dateInput || !slotsContainer) return;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;

  // Static time slots
  const allSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM'
  ];

  function renderTimeSlots() {
    slotsContainer.innerHTML = '';
    selectedSlotInput.value = '';

    // Create pseudo-randomly booked slots based on the date selected
    const dateVal = dateInput.value;
    let bookedIndices = [];
    if (dateVal) {
      const hash = dateVal.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      bookedIndices = [hash % 8, (hash + 3) % 8]; // deterministic mock booked slots
    }

    allSlots.forEach((slot, index) => {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'time-slot';
      slotDiv.textContent = slot;

      if (bookedIndices.includes(index)) {
        slotDiv.classList.add('disabled');
        slotDiv.title = 'Already booked';
      } else {
        slotDiv.addEventListener('click', () => {
          document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
          slotDiv.classList.add('selected');
          selectedSlotInput.value = slot;
        });
      }
      slotsContainer.appendChild(slotDiv);
    });
  }

  // Render on load and on date change
  renderTimeSlots();
  dateInput.addEventListener('change', renderTimeSlots);

  // Form Submission
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('book-name').value;
      const doctor = document.getElementById('book-doctor').options[document.getElementById('book-doctor').selectedIndex].text;
      const date = dateInput.value;
      const slot = selectedSlotInput.value;

      if (!slot) {
        alert('Please select an available time slot.');
        return;
      }

      // Populate Success Summary
      document.getElementById('success-patient').textContent = name;
      document.getElementById('success-doctor').textContent = doctor;
      document.getElementById('success-time').textContent = `${date} at ${slot}`;

      // Toggle views
      appointmentForm.style.display = 'none';
      successContainer.classList.add('active');
    });
  }

  // Handle booking reset
  window.resetBooking = function() {
    if (appointmentForm && successContainer) {
      appointmentForm.reset();
      appointmentForm.style.display = 'block';
      successContainer.classList.remove('active');
      dateInput.value = today;
      renderTimeSlots();
    }
  };
}

// ----------------------------------------------------
// 4. Scroll Reveal Utility
// ----------------------------------------------------
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // trigger animation only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}
