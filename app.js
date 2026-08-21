/**
 * app.js - Application logic for Grambytes Nexus hiring website.
 * Manages UI widgets, multi-step job form logic, file conversions, and secure Apps Script POST.
 */
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global JS Error caught:", message, "at", source, ":", lineno);
  const alertBox = document.getElementById("form-error-alert");
  const alertMsg = document.getElementById("form-error-message");
  if (alertBox && alertMsg) {
    alertMsg.innerText = `System Error: ${message} (Line ${lineno} in ${source.split('/').pop()})`;
    alertBox.classList.remove("hidden");
    try {
      alertBox.scrollIntoView({ behavior: 'smooth' });
    } catch(e) {
      alertBox.scrollIntoView();
    }
  }
  return false;
};

document.addEventListener("DOMContentLoaded", () => {
  const config = window.CONFIG;
  if (!config) {
    console.error("Configuration file CONFIG is missing!");
    return;
  }

  // Icon mapping helper for Lucide Icons
  const iconMap = {
    "chart-bar": "bar-chart-2",
    "lightbulb": "lightbulb",
    "layout": "layout",
    "presentation-chart": "trending-up",
    "excel": "file-spreadsheet",
    "database": "database",
    "chart": "line-chart",
    "eye": "eye",
    "brain": "brain",
    "trending": "pie-chart"
  };

  // 1. Ingest Global Branding & Texts
  document.getElementById("header-logo-text").innerText = config.logoText || config.companyName;
  document.getElementById("footer-logo-text").innerText = config.logoText || config.companyName;
  document.getElementById("copyright").innerHTML = `&copy; ${new Date().getFullYear()} ${config.companyName}. All rights reserved. Data Analytics Campaign.`;

  // Hero section injects
  document.getElementById("hero-badge").innerText = config.hero.badge;
  document.getElementById("hero-title").innerHTML = config.hero.title.replace(
    "Data Analytics Mentor / Trainer",
    `<span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Data Analytics Mentor / Trainer</span>`
  );
  document.getElementById("hero-subtitle").innerText = config.hero.subtitle;
  document.getElementById("hero-description").innerText = config.hero.description;
  document.getElementById("hero-cta-note").innerText = config.hero.ctaNote;

  // Contact section injects
  document.getElementById("contact-email").innerText = config.contact.email;
  document.getElementById("contact-email").href = `mailto:${config.contact.email}`;
  document.getElementById("contact-phone").innerText = config.contact.phone;
  document.getElementById("contact-phone").href = `tel:${config.contact.phone.replace(/[^0-9+]/g, '')}`;
  document.getElementById("contact-location").innerText = config.contact.location;

  // 2. Render Sticky Header & Mobile Navigations
  const desktopNav = document.getElementById("desktop-nav");
  const mobileNavLinks = document.getElementById("mobile-nav-links");
  const footerLinks = document.getElementById("footer-links");

  const navHtml = config.navigation.map(nav => 
    `<a href="${nav.href}" class="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:text-indigo-600">${nav.label}</a>`
  ).join('');
  
  desktopNav.innerHTML = navHtml;

  const mobileNavHtml = config.navigation.map(nav => 
    `<a href="${nav.href}" class="mobile-nav-item text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-all focus:outline-none">${nav.label}</a>`
  ).join('');
  
  mobileNavLinks.innerHTML = mobileNavHtml;

  const footerLinksHtml = config.navigation.map(nav => 
    `<li><a href="${nav.href}" class="hover:text-white transition-colors focus:outline-none focus:text-white">${nav.label}</a></li>`
  ).join('');
  
  footerLinks.innerHTML = footerLinksHtml;

  // 3. Render About the Role Section cards
  const aboutSectionTitle = document.getElementById("about-title");
  const aboutSectionSubtitle = document.getElementById("about-subtitle");
  aboutSectionTitle.innerText = config.aboutRole.title;
  aboutSectionSubtitle.innerText = config.aboutRole.subtitle;

  const aboutGrid = document.getElementById("about-role-grid");
  aboutGrid.innerHTML = config.aboutRole.cards.map(card => `
    <div class="glass-card p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
        <i data-lucide="${iconMap[card.icon] || 'activity'}" class="w-6 h-6"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-3">${card.title}</h3>
      <p class="text-slate-600 text-sm leading-relaxed">${card.description}</p>
    </div>
  `).join('');

  // 4. Render Skills Section cards
  const skillsTitle = document.getElementById("skills-title");
  const skillsSubtitle = document.getElementById("skills-subtitle");
  skillsTitle.innerText = config.keySkills.title;
  skillsSubtitle.innerText = config.keySkills.subtitle;

  const skillsGrid = document.getElementById("skills-grid");
  skillsGrid.innerHTML = config.keySkills.skills.map(skill => `
    <div class="glass-card p-5 rounded-2xl border border-slate-200/50 hover:border-indigo-200/70 hover:shadow-sm transition-all duration-300 flex items-start space-x-4">
      <div class="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
        <i data-lucide="${iconMap[skill.icon] || 'check'}" class="w-5.5 h-5.5"></i>
      </div>
      <div>
        <h3 class="font-bold text-slate-800 text-base mb-1">${skill.name}</h3>
        <p class="text-slate-500 text-xs leading-normal">${skill.description}</p>
      </div>
    </div>
  `).join('');

  // 5. Render Eligibility items
  const eligibilityTitle = document.getElementById("eligibility-title");
  const eligibilitySubtitle = document.getElementById("eligibility-subtitle");
  eligibilityTitle.innerText = config.eligibility.title;
  eligibilitySubtitle.innerText = config.eligibility.subtitle;

  const eligibilityList = document.getElementById("eligibility-list");
  eligibilityList.innerHTML = config.eligibility.items.map(item => `
    <div class="glass-card p-6 rounded-2xl border border-slate-200/60 hover:border-indigo-200/70 hover:shadow-md transition-all duration-300">
      <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center">
        <span class="w-1.5 h-5 bg-indigo-600 rounded-full mr-3 shrink-0"></span>
        ${item.title}
      </h3>
      <p class="text-slate-600 text-sm pl-4 leading-relaxed">${item.description}</p>
    </div>
  `).join('');

  // 6. Render Why Join Us cards
  const whyJoinTitle = document.getElementById("why-join-title");
  const whyJoinSubtitle = document.getElementById("why-join-subtitle");
  whyJoinTitle.innerText = config.whyJoin.title;
  whyJoinSubtitle.innerText = config.whyJoin.subtitle;

  const whyGrid = document.getElementById("why-join-grid");
  whyGrid.innerHTML = config.whyJoin.cards.map(card => `
    <div class="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200/60 hover:border-indigo-200/80 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
        <i data-lucide="award" class="w-5 h-5"></i>
      </div>
      <h3 class="text-lg font-bold text-slate-900 mb-2.5">${card.title}</h3>
      <p class="text-slate-600 text-sm leading-relaxed">${card.description}</p>
    </div>
  `).join('');

  // 7. Render socials in Footer
  const footerSocials = document.getElementById("footer-socials");
  footerSocials.innerHTML = config.contact.socials.map(soc => `
    <a href="${soc.url}" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-white transition-colors" aria-label="${soc.name}">
      <i data-lucide="${soc.icon}" class="w-4 h-4"></i>
    </a>
  `).join('');

  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 8. Sticky Header Scrolling States
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("shadow-md", "bg-white/95", "border-slate-200");
      header.classList.remove("bg-white/80", "border-slate-200/80");
    } else {
      header.classList.remove("shadow-md", "bg-white/95", "border-slate-200");
      header.classList.add("bg-white/80", "border-slate-200/80");
    }
  });

  // 9. Mobile Menu Hamburger Open/Close Toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  mobileToggle.addEventListener("click", () => {
    const isExpanded = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", !isExpanded);
    
    mobileMenu.classList.toggle("hidden");
    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  });

  // Close mobile drawer when a nav link is clicked
  const mobileItems = document.querySelectorAll(".mobile-nav-item");
  mobileItems.forEach(item => {
    item.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });

  // 10. Intersection Observer for Active Nav link highlight
  const sections = document.querySelectorAll("section[id]");
  const desktopLinks = desktopNav.querySelectorAll("a");

  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -25% 0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute("id");
        
        desktopLinks.forEach(link => {
          if (link.getAttribute("href") === `#${activeId}`) {
            link.classList.add("text-indigo-600", "border-b-2", "border-indigo-600", "pb-1");
            link.classList.remove("text-slate-600");
          } else {
            link.classList.remove("text-indigo-600", "border-b-2", "border-indigo-600", "pb-1");
            link.classList.add("text-slate-600");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // 11. Dynamic Mock Dashboard Metrics Simulation
  const metricValues = {
    conversionRate: 14.8,
    responseTime: 240
  };
  const conversionRateEl = document.getElementById("dashboard-conversion-rate");
  const responseTimeEl = document.getElementById("dashboard-response-time");
  setInterval(() => {
    const conversionVariance = (Math.random() * 0.4 - 0.2);
    const responseVariance = Math.floor(Math.random() * 10 - 5);
    if (conversionRateEl) {
      const newVal = (metricValues.conversionRate + conversionVariance).toFixed(1);
      conversionRateEl.innerText = `${newVal}%`;
    }
    if (responseTimeEl) {
      const newVal = Math.max(180, metricValues.responseTime + responseVariance);
      responseTimeEl.innerText = `${newVal}ms`;
    }
  }, 4000);


  // ==========================================
  // MULTI-STEP JOB APPLICATION FORM CODE
  // ==========================================

  let currentStep = 1;
  const totalSteps = 4;
  let uploadedFileData = null; // Store base64 encoded CV data here

  const form = document.getElementById("hiring-application-form");
  const prevBtn = document.getElementById("prev-step-btn");
  const nextBtn = document.getElementById("next-step-btn");
  const submitBtn = document.getElementById("submit-application-btn");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const errorAlert = document.getElementById("form-error-alert");
  const errorMsg = document.getElementById("form-error-message");
  const loadingOverlay = document.getElementById("loading-overlay");
  const successCard = document.getElementById("success-card");

  // Elements for Drag & Drop Dropzone
  const resumeInput = document.getElementById("resume");
  const resumeDropzone = document.getElementById("resume-dropzone");
  const fileSelectedName = document.getElementById("file-selected-name");
  const fileIconBox = document.getElementById("file-icon-box");

  // Sync click on dropzone to open browser file selector
  resumeDropzone.addEventListener("click", (e) => {
    if (e.target !== resumeInput) {
      resumeInput.click();
    }
  });

  // Handle Drag & Drop styling
  ['dragenter', 'dragover'].forEach(eventName => {
    resumeDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      resumeDropzone.classList.add('border-indigo-500', 'bg-indigo-50/30');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    resumeDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      resumeDropzone.classList.remove('border-indigo-500', 'bg-indigo-50/30');
    }, false);
  });

  // Handle file drop
  resumeDropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      resumeInput.files = files;
      handleFileSelection(files[0]);
    }
  });

  // Handle standard input select
  resumeInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  });

  /**
   * Reads the uploaded file, validates size limit, and encodes it into a Base64 string.
   */
  function handleFileSelection(file) {
    // Validate File Size (10 MB Limit)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert("File size exceeds 10MB limit. Please upload a smaller Resume / CV.");
      resumeInput.value = "";
      uploadedFileData = null;
      fileSelectedName.classList.add("hidden");
      fileIconBox.innerHTML = `<i data-lucide="upload-cloud" class="w-6 h-6 text-rose-500 animate-bounce"></i>`;
      window.lucide.createIcons();
      return;
    }

    // Read file as Base64 string
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result.split(',')[1]; // Strip URL prefix
      uploadedFileData = {
        filename: file.name,
        mimeType: file.type,
        base64: base64Data
      };
      
      // Update UI feedback
      fileSelectedName.innerText = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
      fileSelectedName.classList.remove("hidden");
      
      fileIconBox.innerHTML = `<i data-lucide="check" class="w-6 h-6 text-emerald-600"></i>`;
      fileIconBox.className = "w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto";
      
      // Clear error validation marker if present
      hideValidationError(resumeInput);
      window.lucide.createIcons();
    };

    reader.onerror = () => {
      alert("Failed to read file. Please try again.");
    };

    reader.readAsDataURL(file);
  }

  // Next Button Click Handler
  nextBtn.addEventListener("click", () => {
    try {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    } catch (err) {
      console.error("Next button transition crash:", err);
      showAlert(`Navigation Error: ${err.message}`);
    }
  });

  // Prev Button Click Handler
  prevBtn.addEventListener("click", () => {
    try {
      goToStep(currentStep - 1);
    } catch (err) {
      console.error("Prev button transition crash:", err);
      showAlert(`Navigation Error: ${err.message}`);
    }
  });

  /**
   * Transition form content views and update navigation elements.
   */
  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    // Toggle Section Panels visibility
    document.querySelectorAll(".step-section").forEach((sec, index) => {
      if (index === step - 1) {
        sec.classList.remove("hidden");
      } else {
        sec.classList.add("hidden");
      }
    });

    // Update step numbers visual labels
    document.querySelectorAll(".step-indicator").forEach((ind, index) => {
      if (index === step - 1) {
        ind.classList.add("text-indigo-600", "active");
        ind.classList.remove("text-slate-400");
      } else if (index < step - 1) {
        ind.classList.add("text-indigo-600");
        ind.classList.remove("text-slate-400", "active");
      } else {
        ind.classList.add("text-slate-400");
        ind.classList.remove("text-indigo-600", "active");
      }
    });

    // Animate Progress Bar
    if (progressBarFill) {
      progressBarFill.style.width = `${(step / totalSteps) * 100}%`;
    }

    // Toggle Prev Button
    if (step === 1) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
    }

    // Toggle Next vs Submit Buttons
    if (step === totalSteps) {
      nextBtn.classList.add("hidden");
      submitBtn.classList.remove("hidden");
    } else {
      nextBtn.classList.remove("hidden");
      submitBtn.classList.add("hidden");
    }

    currentStep = step;
    
    // Smooth scroll to form header to keep context defensively
    try {
      const appSection = document.getElementById("application");
      if (appSection) {
        appSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (scrollErr) {
      console.warn("Smooth scrolling failed, falling back to simple scroll:", scrollErr);
      try {
        const appSection = document.getElementById("application");
        if (appSection) {
          appSection.scrollIntoView();
        }
      } catch (innerScrollErr) {
        console.error("Fallback scroll failed:", innerScrollErr);
      }
    }
  }

  /**
   * Input format checkers
   */
  function validateEmail(emailVal) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailVal);
  }

  /**
   * Check inputs of the current page and display validation errors.
   */
  function validateStep(step) {
    let isValid = true;
    hideAlert();

    if (step === 1) {
      // Validate Full Name
      const name = document.getElementById("fullName");
      if (!name.value.trim()) {
        showValidationError(name, "Full Name is required.");
        isValid = false;
      } else {
        hideValidationError(name);
      }

      // Validate Mobile Number
      const mobile = document.getElementById("mobileNumber");
      if (!mobile.value.trim() || mobile.value.trim().length < 8) {
        showValidationError(mobile, "Please enter a valid mobile number.");
        isValid = false;
      } else {
        hideValidationError(mobile);
      }

      // Validate Email Address
      const email = document.getElementById("email");
      if (!email.value.trim() || !validateEmail(email.value.trim())) {
        showValidationError(email, "Please enter a valid email address.");
        isValid = false;
      } else {
        hideValidationError(email);
      }

      // Validate Location
      const location = document.getElementById("location");
      if (!location.value.trim()) {
        showValidationError(location, "Current Location / City is required.");
        isValid = false;
      } else {
        hideValidationError(location);
      }

    } else if (step === 2) {
      // Validate Total Experience (Radio)
      const experience = document.querySelector('input[name="totalExperience"]:checked');
      const expRadioContainer = document.querySelector('input[name="totalExperience"]').closest('.space-y-2\\.5');
      if (!experience) {
        showCustomValidationError(expRadioContainer, "Experience selection is required.");
        isValid = false;
      } else {
        hideCustomValidationError(expRadioContainer);
      }

      // Validate Work Mode (Radio)
      const workMode = document.querySelector('input[name="workMode"]:checked');
      const workModeContainer = document.querySelector('input[name="workMode"]').closest('.space-y-2\\.5');
      if (!workMode) {
        showCustomValidationError(workModeContainer, "Work Mode selection is required.");
        isValid = false;
      } else {
        hideCustomValidationError(workModeContainer);
      }

      // Validate Engagement Type (Radio)
      const engagementType = document.querySelector('input[name="engagementType"]:checked');
      const engagementContainer = document.querySelector('input[name="engagementType"]').closest('.space-y-2\\.5');
      if (!engagementType) {
        showCustomValidationError(engagementContainer, "Engagement Type selection is required.");
        isValid = false;
      } else {
        hideCustomValidationError(engagementContainer);
      }

      // Validate Employment Status (Radio)
      const status = document.querySelector('input[name="employmentStatus"]:checked');
      const statusContainer = document.querySelector('input[name="employmentStatus"]').closest('.space-y-2\\.5');
      if (!status) {
        showCustomValidationError(statusContainer, "Employment Status is required.");
        isValid = false;
      } else {
        hideCustomValidationError(statusContainer);
      }

    } else if (step === 3) {
      // Validate Technologies Checkboxes (At least one checked)
      const checkedTools = document.querySelectorAll('input[name="teachingTools"]:checked');
      const toolsContainer = document.querySelector('input[name="teachingTools"]').closest('.space-y-2\\.5');
      if (checkedTools.length === 0) {
        showCustomValidationError(toolsContainer, "Please select at least one technology.");
        isValid = false;
      } else {
        hideCustomValidationError(toolsContainer);
      }

      // Validate Expertise (Radio)
      const expertise = document.querySelector('input[name="analyticsExpertise"]:checked');
      const expertiseContainer = document.querySelector('input[name="analyticsExpertise"]').closest('.space-y-2\\.5');
      if (!expertise) {
        showCustomValidationError(expertiseContainer, "Please rate your Data Analytics expertise.");
        isValid = false;
      } else {
        hideCustomValidationError(expertiseContainer);
      }

      // Validate Real-world Projects (Radio)
      const projects = document.querySelector('input[name="realWorldProjects"]:checked');
      const projectsContainer = document.querySelector('input[name="realWorldProjects"]').closest('.space-y-2\\.5');
      if (!projects) {
        showCustomValidationError(projectsContainer, "Project selection is required.");
        isValid = false;
      } else {
        hideCustomValidationError(projectsContainer);
      }

      // Validate Prior Teaching (Radio)
      const priorTeaching = document.querySelector('input[name="priorTeaching"]:checked');
      const priorTeachingContainer = document.querySelector('input[name="priorTeaching"]').closest('.space-y-2\\.5');
      if (!priorTeaching) {
        showCustomValidationError(priorTeachingContainer, "Teaching experience selection is required.");
        isValid = false;
      } else {
        hideCustomValidationError(priorTeachingContainer);
      }

    } else if (step === 4) {
      // Validate Resume (file)
      const resumeContainer = resumeInput.closest('.space-y-2');
      if (!uploadedFileData) {
        showCustomValidationError(resumeContainer, "Please upload your Resume / CV file.");
        isValid = false;
      } else {
        hideCustomValidationError(resumeContainer);
      }

      // Validate Start Date (Radio)
      const startDate = document.querySelector('input[name="startDate"]:checked');
      const startDateContainer = document.querySelector('input[name="startDate"]').closest('.space-y-2\\.5');
      if (!startDate) {
        showCustomValidationError(startDateContainer, "Please specify when you can start.");
        isValid = false;
      } else {
        hideCustomValidationError(startDateContainer);
      }

      // Validate Availability (Checkboxes)
      const checkedAvailability = document.querySelectorAll('input[name="trainingAvailability"]:checked');
      const availabilityContainer = document.querySelector('input[name="trainingAvailability"]').closest('.space-y-2\\.5');
      if (checkedAvailability.length === 0) {
        showCustomValidationError(availabilityContainer, "Please select at least one availability slot.");
        isValid = false;
      } else {
        hideCustomValidationError(availabilityContainer);
      }

      // Validate Consent Checkbox
      const consent = document.getElementById("consentConfirm");
      const consentContainer = consent.closest('.space-y-2');
      if (!consent.checked) {
        showCustomValidationError(consentContainer, "You must check the consent statement to submit.");
        isValid = false;
      } else {
        hideCustomValidationError(consentContainer);
      }
    }

    return isValid;
  }

  function showValidationError(inputElem, message) {
    inputElem.classList.add("border-rose-500", "focus:border-rose-500", "focus:ring-rose-500");
    const parentNode = inputElem.closest(".space-y-1\\.5");
    if (parentNode) {
      const err = parentNode.querySelector(".error-msg");
      if (err) {
        err.innerText = message;
        err.classList.remove("hidden");
      }
    }
  }

  function hideValidationError(inputElem) {
    inputElem.classList.remove("border-rose-500", "focus:border-rose-500", "focus:ring-rose-500");
    const parentNode = inputElem.closest(".space-y-1\\.5");
    if (parentNode) {
      const err = parentNode.querySelector(".error-msg");
      if (err) {
        err.classList.add("hidden");
      }
    }
  }

  function showCustomValidationError(containerElem, message) {
    const err = containerElem.querySelector(".error-msg");
    if (err) {
      err.innerText = message;
      err.classList.remove("hidden");
    }
  }

  function hideCustomValidationError(containerElem) {
    const err = containerElem.querySelector(".error-msg");
    if (err) {
      err.classList.add("hidden");
    }
  }

  function showAlert(msg) {
    errorMsg.innerText = msg;
    errorAlert.classList.remove("hidden");
    errorAlert.scrollIntoView({ behavior: 'smooth' });
  }

  function hideAlert() {
    errorAlert.classList.add("hidden");
  }

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();

    // Final Validation check for step 4
    if (!validateStep(4)) {
      return;
    }

    // SECURE CREDENTIAL CHECK
    if (!config.appsScriptUrl || config.appsScriptUrl.trim() === "") {
      showAlert("Configuration Error: The Apps Script Web App URL is missing. Please edit config.js to insert the deployed Web App URL.");
      return;
    }

    // 12. State Handling: Show Loading spinner & Disable buttons to prevent duplicate submission
    loadingOverlay.classList.remove("hidden");
    submitBtn.disabled = true;
    prevBtn.disabled = true;

    // Gather Form Payload Data
    const payload = {
      email: document.getElementById("email").value.trim(),
      fullName: document.getElementById("fullName").value.trim(),
      mobileNumber: document.getElementById("mobileNumber").value.trim(),
      emailAddress: document.getElementById("email").value.trim(), // duplicates to manual email address
      location: document.getElementById("location").value.trim(),
      totalExperience: document.querySelector('input[name="totalExperience"]:checked').value,
      workMode: document.querySelector('input[name="workMode"]:checked').value,
      engagementType: document.querySelector('input[name="engagementType"]:checked').value,
      currentJobRole: document.getElementById("currentJobRole").value.trim(),
      currentCompany: document.getElementById("currentCompany").value.trim(),
      previousExperience: document.getElementById("previousExperience").value.trim(),
      employmentStatus: document.querySelector('input[name="employmentStatus"]:checked').value,
      teachingTools: Array.from(document.querySelectorAll('input[name="teachingTools"]:checked')).map(cb => cb.value),
      analyticsExpertise: document.querySelector('input[name="analyticsExpertise"]:checked').value,
      realWorldProjects: document.querySelector('input[name="realWorldProjects"]:checked').value,
      portfolioUrl: document.getElementById("portfolioUrl").value.trim(),
      priorTeaching: document.querySelector('input[name="priorTeaching"]:checked').value,
      teachingDescription: document.getElementById("teachingDescription").value.trim(),
      resume: uploadedFileData, // Stores filename, mimeType, and Base64 string
      startDate: document.querySelector('input[name="startDate"]:checked').value,
      trainingAvailability: Array.from(document.querySelectorAll('input[name="trainingAvailability"]:checked')).map(cb => cb.value),
      reasonToJoin: document.getElementById("reasonToJoin").value.trim(),
      consent: document.getElementById("consentConfirm").checked,
      consentConfirm: document.getElementById("consentConfirm").checked
    };

    try {
      // POST data securely to Google Apps Script
      // Content-Type is text/plain to completely bypass CORS preflight OPTIONS blockages
      const response = await fetch(config.appsScriptUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP network error: status ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === "success") {
        // Success State Action
        successCard.classList.remove("hidden");
        form.reset();
        resetFileInput();
      } else {
        throw new Error(result.message || "Failed to save records in target database.");
      }

    } catch (err) {
      console.error("Submission Failure:", err);
      // Keep candidate inputs intact, only hide loader and show error
      showAlert(`Submission Failed: ${err.message}. Please check your connection and try again.`);
    } finally {
      loadingOverlay.classList.add("hidden");
      submitBtn.disabled = false;
      prevBtn.disabled = false;
    }
  });

  /**
   * Reset file inputs and dropzone visual properties
   */
  function resetFileInput() {
    uploadedFileData = null;
    resumeInput.value = "";
    fileSelectedName.classList.add("hidden");
    fileIconBox.className = "w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto";
    fileIconBox.innerHTML = `<i data-lucide="upload-cloud" class="w-6 h-6"></i>`;
    window.lucide.createIcons();
  }

  // Handle "Back to Home" after success
  document.getElementById("back-home-btn").addEventListener("click", () => {
    successCard.classList.add("hidden");
    goToStep(1); // Reset form steps visually
    document.getElementById("home").scrollIntoView({ behavior: 'smooth' });
  });

});
