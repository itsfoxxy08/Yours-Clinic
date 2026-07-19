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
      if (window.scrollY >= sectionTop - 120) {
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

  // Setup Admin Portal Logic
  setupAdminPortal();

  // Setup Dark Mode Theme Logic
  setupDarkModeTheme();

  // Setup Footer Modals & Join Our Team Logic
  setupFooterModals();
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

// ----------------------------------------------------
// 5. Admin Portal Login & Dashboard Logic
// ----------------------------------------------------
function setupAdminPortal() {
  const adminBtn = document.getElementById('admin-portal-btn');
  const loginModal = document.getElementById('admin-login-modal');
  const closeLoginBtn = document.getElementById('close-login-btn');
  const loginForm = document.getElementById('admin-login-form');
  const errorPanel = document.getElementById('admin-login-error');
  const errorText = document.getElementById('admin-error-text');
  const submitBtnText = document.getElementById('login-btn-text');
  const spinner = document.getElementById('login-spinner');
  
  const dashboard = document.getElementById('admin-dashboard');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const navItems = document.querySelectorAll('.admin-nav-item');
  const viewSections = document.querySelectorAll('.admin-view-section');
  
  // Data lists
  let patients = JSON.parse(localStorage.getItem('yoursClinicPatients')) || [];
  let awards = JSON.parse(localStorage.getItem('yoursClinicAwards')) || [
    { id: '1', title: 'Best Community Healthcare Clinic 2025', icon: '🏆', desc: 'Awarded for exceptional medical services and high patient safety ratings.' },
    { id: '2', title: 'Accredited ISO Quality Standard', icon: '🛡️', desc: 'Certified for compliance with global medical safety protocols and procedures.' },
    { id: '3', title: 'Digital Health Innovation Award', icon: '🥇', desc: 'Recognized for pioneering online symptoms triage and patient intake workflows.' }
  ];
  let applicants = JSON.parse(localStorage.getItem('yoursClinicApplicants')) || [];

  // Save initial seed awards if empty
  if (!localStorage.getItem('yoursClinicAwards')) {
    localStorage.setItem('yoursClinicAwards', JSON.stringify(awards));
  }

  // Open login modal
  if (adminBtn && loginModal) {
    adminBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // If already logged in, skip login and open dashboard
      if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        openDashboard();
      } else {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close login modal
  const closeLogin = () => {
    if (loginModal) {
      loginModal.classList.remove('active');
      document.body.style.overflow = '';
      if (loginForm) loginForm.reset();
      if (errorPanel) errorPanel.style.display = 'none';
    }
  };

  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeLogin();
    });
  }
  
  const overlay = document.getElementById('admin-login-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeLogin);
  }

  // Login Authentication Handler
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const user = document.getElementById('admin-username').value;
      const pass = document.getElementById('admin-password').value;

      if (errorPanel) errorPanel.style.display = 'none';
      if (spinner) spinner.style.display = 'inline-block';
      if (submitBtnText) submitBtnText.textContent = 'Authenticating...';

      // Mock delay for a secure feel
      setTimeout(() => {
        if (user === 'YoursClinicTeam' && pass === 'admin@123') {
          sessionStorage.setItem('isAdminLoggedIn', 'true');
          closeLogin();
          openDashboard();
        } else {
          if (errorPanel) {
            errorPanel.style.display = 'flex';
            errorText.textContent = 'Incorrect credentials. Access denied.';
          }
          if (spinner) spinner.style.display = 'none';
          if (submitBtnText) submitBtnText.textContent = 'Authenticate Securely';
        }
      }, 1000);
    });
  }

  // Check login state on load
  if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
    openDashboard();
  } else {
    renderPublicAwards();
  }

  function openDashboard() {
    if (dashboard) {
      dashboard.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Reset view to overview tab
      switchTab('admin-view-overview');
      initDashboardStats();
      renderPatients();
      renderAdminAwards();
      renderPublicAwards();
      renderApplicants();
    }
  }

  function closeDashboard() {
    if (dashboard) {
      dashboard.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('isAdminLoggedIn');
      closeDashboard();
      // Reset button states
      if (spinner) spinner.style.display = 'none';
      if (submitBtnText) submitBtnText.textContent = 'Authenticate Securely';
    });
  }

  // Tab switching in Admin Dashboard
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      const target = item.getAttribute('data-target');
      switchTab(target);
    });
  });

  function switchTab(targetId) {
    viewSections.forEach(section => {
      if (section.getAttribute('id') === targetId) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }

  function initDashboardStats() {
    const patientsCountEl = document.getElementById('stat-patients-count');
    const awardsCountEl = document.getElementById('stat-awards-count');
    const applicantsCountEl = document.getElementById('stat-applicants-count');
    
    if (patientsCountEl) patientsCountEl.textContent = patients.length;
    if (awardsCountEl) awardsCountEl.textContent = awards.length;
    if (applicantsCountEl) applicantsCountEl.textContent = applicants.length;
  }

  // --- Patients Panel CRUD ---
  const patientForm = document.getElementById('admin-patient-form');
  const patientsListContainer = document.getElementById('admin-patients-list');
  const patientSearchInput = document.getElementById('admin-patient-search');

  if (patientForm) {
    patientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newPatient = {
        id: Date.now().toString(),
        name: document.getElementById('admin-p-name').value,
        age: document.getElementById('admin-p-age').value,
        gender: document.getElementById('admin-p-gender').value,
        phone: document.getElementById('admin-p-phone').value,
        doctor: document.getElementById('admin-p-doctor').value,
        notes: document.getElementById('admin-p-notes').value
      };

      patients.push(newPatient);
      localStorage.setItem('yoursClinicPatients', JSON.stringify(patients));
      
      patientForm.reset();
      renderPatients();
      initDashboardStats();
    });
  }

  function renderPatients() {
    if (!patientsListContainer) return;
    
    const filterText = patientSearchInput ? patientSearchInput.value.toLowerCase() : '';
    patientsListContainer.innerHTML = '';
    
    const filteredPatients = patients.filter(p => 
      p.name.toLowerCase().includes(filterText) || 
      p.doctor.toLowerCase().includes(filterText) ||
      p.notes.toLowerCase().includes(filterText)
    );

    if (filteredPatients.length === 0) {
      patientsListContainer.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--color-slate-gray);">No patients found.</td></tr>`;
      return;
    }

    filteredPatients.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 500;">${escapeHtml(p.name)}</td>
        <td>${p.age} yrs / ${p.gender}</td>
        <td>${escapeHtml(p.doctor)}</td>
        <td>${escapeHtml(p.notes)}</td>
        <td>
          <button class="admin-action-btn admin-action-btn-delete" data-id="${p.id}" title="Delete Record">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      patientsListContainer.appendChild(tr);
    });

    // Delete hooks
    const deleteBtns = patientsListContainer.querySelectorAll('.admin-action-btn-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        patients = patients.filter(p => p.id !== id);
        localStorage.setItem('yoursClinicPatients', JSON.stringify(patients));
        renderPatients();
        initDashboardStats();
      });
    });
  }

  if (patientSearchInput) {
    patientSearchInput.addEventListener('input', renderPatients);
  }

  // --- Awards Panel CRUD ---
  const awardForm = document.getElementById('admin-award-form');
  const adminAwardsListContainer = document.getElementById('admin-awards-list');
  const publicAwardsGrid = document.getElementById('public-awards-grid');

  if (awardForm) {
    awardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newAward = {
        id: Date.now().toString(),
        title: document.getElementById('admin-a-title').value,
        icon: document.getElementById('admin-a-icon').value,
        desc: document.getElementById('admin-a-desc').value
      };

      awards.push(newAward);
      localStorage.setItem('yoursClinicAwards', JSON.stringify(awards));
      
      awardForm.reset();
      renderAdminAwards();
      renderPublicAwards();
      initDashboardStats();
    });
  }

  function renderAdminAwards() {
    if (!adminAwardsListContainer) return;
    adminAwardsListContainer.innerHTML = '';

    if (awards.length === 0) {
      adminAwardsListContainer.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--color-slate-gray);">No accolades published.</td></tr>`;
      return;
    }

    awards.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-size: 1.5rem; text-align: center;">${a.icon}</td>
        <td style="font-weight: 500;">${escapeHtml(a.title)}</td>
        <td>${escapeHtml(a.desc)}</td>
        <td>
          <button class="admin-action-btn admin-action-btn-delete" data-id="${a.id}" title="Remove Accolade">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      adminAwardsListContainer.appendChild(tr);
    });

    // Delete hooks
    const deleteBtns = adminAwardsListContainer.querySelectorAll('.admin-action-btn-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        awards = awards.filter(a => a.id !== id);
        localStorage.setItem('yoursClinicAwards', JSON.stringify(awards));
        renderAdminAwards();
        renderPublicAwards();
        initDashboardStats();
      });
    });
  }

  function renderPublicAwards() {
    if (!publicAwardsGrid) return;
    publicAwardsGrid.innerHTML = '';

    if (awards.length === 0) {
      publicAwardsGrid.innerHTML = `<p class="text-center" style="grid-column: span 3; color: var(--color-slate-gray);">No awards published yet.</p>`;
      return;
    }

    awards.forEach(a => {
      const card = document.createElement('div');
      card.className = 'award-card';
      card.innerHTML = `
        <div class="award-card-icon">${a.icon}</div>
        <div class="award-card-info">
          <h4>${escapeHtml(a.title)}</h4>
          <p>${escapeHtml(a.desc)}</p>
        </div>
      `;
      publicAwardsGrid.appendChild(card);
    });
  }

  // --- Applicants Log CRUD ---
  const applicantsListContainer = document.getElementById('admin-applicants-list');

  function renderApplicants() {
    if (!applicantsListContainer) return;
    applicantsListContainer.innerHTML = '';
    
    // Refresh applicants array from storage to stay in sync
    applicants = JSON.parse(localStorage.getItem('yoursClinicApplicants')) || [];

    if (applicants.length === 0) {
      applicantsListContainer.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-slate-gray);">No applications submitted.</td></tr>`;
      return;
    }

    applicants.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 500;">${escapeHtml(a.name)}</td>
        <td>${escapeHtml(a.email)}<br><span style="font-size: 0.85rem; color: var(--color-slate-gray);">${escapeHtml(a.phone)}</span></td>
        <td><span class="badge" style="margin-bottom:0;">${escapeHtml(a.role)}</span></td>
        <td>${a.experience} yrs</td>
        <td style="font-size: 0.875rem;">${escapeHtml(a.notes || 'N/A')}</td>
        <td>
          <button class="admin-action-btn admin-action-btn-delete admin-action-btn-delete-applicant" data-id="${a.id}" title="Remove Application">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      applicantsListContainer.appendChild(tr);
    });

    // Delete hooks
    const deleteBtns = applicantsListContainer.querySelectorAll('.admin-action-btn-delete-applicant');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        applicants = applicants.filter(a => a.id !== id);
        localStorage.setItem('yoursClinicApplicants', JSON.stringify(applicants));
        renderApplicants();
        initDashboardStats();
      });
    });
  }

  // HTML escaping helper
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }
}

// ----------------------------------------------------
// 6. Dark Mode Toggle & Preference Persistence
// ----------------------------------------------------
function setupDarkModeTheme() {
  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (!toggleBtn) return;

  const toggleIcon = toggleBtn.querySelector('i');
  
  // Load saved theme preference
  const currentTheme = localStorage.getItem('yoursClinicTheme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-sun';
    }
  } else {
    document.body.classList.remove('dark-theme');
    if (toggleIcon) {
      toggleIcon.className = 'fa-solid fa-moon';
    }
  }

  // Toggle theme click listener
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('yoursClinicTheme', 'dark');
      if (toggleIcon) {
        toggleIcon.className = 'fa-solid fa-sun';
      }
    } else {
      localStorage.setItem('yoursClinicTheme', 'light');
      if (toggleIcon) {
        toggleIcon.className = 'fa-solid fa-moon';
      }
    }
  });
}

// ----------------------------------------------------
// 7. Footer Modals & Join Our Team Careers Flow
// ----------------------------------------------------
function setupFooterModals() {
  // Join Team / Careers Modal
  const joinBtn = document.getElementById('join-team-btn');
  const careersModal = document.getElementById('careers-modal');
  const careersClose = document.getElementById('careers-close-btn');
  const careersOverlay = document.getElementById('careers-overlay');
  const careersForm = document.getElementById('careers-form');
  const successMsg = document.getElementById('careers-success-msg');
  const successClose = document.getElementById('careers-success-close');

  const openCareers = () => {
    if (careersModal) {
      careersModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (careersForm) {
        careersForm.style.display = 'block';
        careersForm.reset();
      }
      if (successMsg) successMsg.style.display = 'none';
    }
  };

  const closeCareers = () => {
    if (careersModal) {
      careersModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (joinBtn) joinBtn.addEventListener('click', openCareers);
  if (careersClose) careersClose.addEventListener('click', closeCareers);
  if (careersOverlay) careersOverlay.addEventListener('click', closeCareers);
  if (successClose) successClose.addEventListener('click', closeCareers);

  // Submit Application Form Handler
  if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newApplicant = {
        id: Date.now().toString(),
        name: document.getElementById('career-name').value,
        email: document.getElementById('career-email').value,
        phone: document.getElementById('career-phone').value,
        role: document.getElementById('career-role').value,
        experience: document.getElementById('career-experience').value,
        notes: document.getElementById('career-notes').value
      };

      const applicants = JSON.parse(localStorage.getItem('yoursClinicApplicants')) || [];
      applicants.push(newApplicant);
      localStorage.setItem('yoursClinicApplicants', JSON.stringify(applicants));

      // Toggle views
      careersForm.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';

      // Update admin stats if setup
      const statsEl = document.getElementById('stat-applicants-count');
      if (statsEl) statsEl.textContent = applicants.length;
    });
  }

  // --- Disclaimer Modal Hooks ---
  const disclaimerLink = document.getElementById('footer-link-disclaimer');
  const disclaimerModal = document.getElementById('disclaimer-modal');
  const disclaimerClose = document.getElementById('disclaimer-close-btn');
  const disclaimerOverlay = document.getElementById('disclaimer-overlay');

  const toggleDisclaimer = (show) => {
    if (disclaimerModal) {
      if (show) {
        disclaimerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        disclaimerModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };

  if (disclaimerLink) {
    disclaimerLink.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDisclaimer(true);
    });
  }
  if (disclaimerClose) disclaimerClose.addEventListener('click', () => toggleDisclaimer(false));
  if (disclaimerOverlay) disclaimerOverlay.addEventListener('click', () => toggleDisclaimer(false));

  // --- Privacy Modal Hooks ---
  const privacyLink = document.getElementById('footer-link-privacy');
  const privacyModal = document.getElementById('privacy-modal');
  const privacyClose = document.getElementById('privacy-close-btn');
  const privacyOverlay = document.getElementById('privacy-overlay');

  const togglePrivacy = (show) => {
    if (privacyModal) {
      if (show) {
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        privacyModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };

  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      togglePrivacy(true);
    });
  }
  if (privacyClose) privacyClose.addEventListener('click', () => togglePrivacy(false));
  if (privacyOverlay) privacyOverlay.addEventListener('click', () => togglePrivacy(false));
}
