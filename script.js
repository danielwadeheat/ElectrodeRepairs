'use strict';

const canonicalHref = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
const baseUrl = canonicalHref.endsWith('/') ? canonicalHref : `${canonicalHref}/`;
const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
const businessEmail = 'Info@electroderepairs.com';
const businessPhone = '+1-405-268-6305';
const businessAddress = {
  '@type': 'PostalAddress',
  streetAddress: '1025 N Main St',
  addressLocality: 'Newcastle',
  addressRegion: 'OK',
  postalCode: '73065',
  addressCountry: 'US',
};
const businessHours = ['Tu 10:00-18:00', 'We 10:00-18:00', 'Th 10:00-18:00', 'Fr 10:00-18:00', 'Sa 10:00-18:00'];

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Electrode Repairs',
  description: pageDescription,
  url: canonicalHref,
  telephone: businessPhone,
  email: businessEmail,
  image: new URL('assets/images/building_front.jpg', baseUrl).toString(),
  logo: new URL('assets/images/logo.png', baseUrl).toString(),
  address: businessAddress,
  openingHours: businessHours,
  areaServed: 'Newcastle, OK',
  sameAs: ['https://www.instagram.com/electrode_repairs/', 'https://www.facebook.com/ElectrodeRepairs'],
};

const existingStructuredDataScript = document.getElementById('local-business-jsonld');
if (existingStructuredDataScript) {
  existingStructuredDataScript.remove();
}

const structuredDataScript = document.createElement('script');
structuredDataScript.id = 'local-business-jsonld';
structuredDataScript.type = 'application/ld+json';
structuredDataScript.text = JSON.stringify(structuredData);
document.head.appendChild(structuredDataScript);

const emailTrigger = document.querySelector('[data-email-trigger]');
const emailMenu = document.querySelector('[data-email-menu]');
const copyEmailButton = document.querySelector('[data-copy-email-btn]');
const openMailOption = emailMenu?.querySelector('a[href^="mailto:"][data-email-option]') || null;

function showEmailToast(message) {
  let toast = document.querySelector('.email-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'email-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');

  window.clearTimeout(showEmailToast.timeoutId);
  showEmailToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 1700);
}

function closeEmailMenu() {
  if (!emailTrigger || !emailMenu) {
    return;
  }
  emailMenu.hidden = true;
  emailTrigger.setAttribute('aria-expanded', 'false');
}

function openMailClient() {
  window.location.assign(`mailto:${businessEmail}`);
}

if (emailTrigger && emailMenu && copyEmailButton) {
  emailTrigger.addEventListener('click', () => {
    const menuIsOpen = !emailMenu.hidden;
    emailMenu.hidden = menuIsOpen;
    emailTrigger.setAttribute('aria-expanded', String(!menuIsOpen));
  });

  if (openMailOption) {
    openMailOption.addEventListener('click', (event) => {
      event.preventDefault();
      closeEmailMenu();
      openMailClient();

      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          showEmailToast('If Mail did not open, choose Copy Email.');
        }
      }, 900);
    });
  }

  copyEmailButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(businessEmail);
      showEmailToast('Copied to clipboard');
    } catch {
      showEmailToast('Copy failed. Opening mail app...');
      openMailClient();
    }
    closeEmailMenu();
  });

  emailMenu.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('[data-email-option]')) {
      closeEmailMenu();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Node && !emailMenu.contains(target) && !emailTrigger.contains(target)) {
      closeEmailMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeEmailMenu();
    }
  });
}

const contactTopicField = document.querySelector('.contact-topic-field');
const nativeTopicSelect = contactTopicField?.querySelector('#topic');
const customTopic = contactTopicField?.querySelector('[data-contact-topic]');

if (contactTopicField && nativeTopicSelect && customTopic) {
  const topicTrigger = customTopic.querySelector('.contact-topic-trigger');
  const topicLabel = customTopic.querySelector('[data-contact-topic-label]');
  const topicMenu = customTopic.querySelector('.contact-topic-menu');
  const topicOptions = Array.from(customTopic.querySelectorAll('.contact-topic-option'));

  if (topicTrigger && topicLabel && topicMenu && topicOptions.length > 0) {
    customTopic.hidden = false;
    contactTopicField.classList.add('is-topic-enhanced');

    function closeTopicMenu({ focusTrigger = false } = {}) {
      customTopic.classList.remove('is-open');
      topicMenu.hidden = true;
      topicTrigger.setAttribute('aria-expanded', 'false');
      if (focusTrigger) {
        topicTrigger.focus();
      }
    }

    function syncTopicUi() {
      const selectedOption = nativeTopicSelect.selectedOptions[0] || null;
      const selectedValue = selectedOption?.value || '';
      const selectedText = selectedOption?.textContent?.trim() || 'Select a topic';

      topicLabel.textContent = selectedValue ? selectedText : 'Select a topic';
      topicTrigger.setAttribute('aria-invalid', String(!selectedValue));

      topicOptions.forEach((option, index) => {
        const isSelected = option.dataset.value === selectedValue;
        option.classList.toggle('is-selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
        option.tabIndex = isSelected ? 0 : -1;

        if (!selectedValue && index === 0) {
          option.tabIndex = 0;
        }
      });
    }

    function openTopicMenu() {
      customTopic.classList.add('is-open');
      topicMenu.hidden = false;
      topicTrigger.setAttribute('aria-expanded', 'true');

      const activeOption = topicOptions.find((option) => option.classList.contains('is-selected')) || topicOptions[0];
      if (activeOption) {
        activeOption.focus();
      }
    }

    function selectTopic(value) {
      if (!value) {
        return;
      }
      nativeTopicSelect.value = value;
      nativeTopicSelect.dispatchEvent(new Event('change', { bubbles: true }));
      closeTopicMenu({ focusTrigger: true });
    }

    function moveTopicFocus(step) {
      const currentIndex = topicOptions.findIndex((option) => option === document.activeElement);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + step + topicOptions.length) % topicOptions.length;
      topicOptions[nextIndex]?.focus();
    }

    syncTopicUi();

    topicTrigger.addEventListener('click', () => {
      if (topicMenu.hidden) {
        openTopicMenu();
        return;
      }
      closeTopicMenu();
    });

    topicTrigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openTopicMenu();
      }
    });

    topicMenu.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const option = target.closest('.contact-topic-option');
      if (option instanceof HTMLButtonElement) {
        selectTopic(option.dataset.value || '');
      }
    });

    topicMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeTopicMenu({ focusTrigger: true });
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveTopicFocus(1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveTopicFocus(-1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        topicOptions[0]?.focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        topicOptions[topicOptions.length - 1]?.focus();
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        const focusedOption = document.activeElement;
        if (focusedOption instanceof HTMLButtonElement && focusedOption.classList.contains('contact-topic-option')) {
          event.preventDefault();
          selectTopic(focusedOption.dataset.value || '');
        }
      }
    });

    nativeTopicSelect.addEventListener('change', syncTopicUi);

    const contactForm = nativeTopicSelect.form;
    if (contactForm) {
      contactForm.addEventListener('submit', (event) => {
        if (nativeTopicSelect.value) {
          return;
        }
        event.preventDefault();
        openTopicMenu();
      });

      contactForm.addEventListener('reset', () => {
        window.setTimeout(syncTopicUi, 0);
      });
    }

    customTopic.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!customTopic.contains(document.activeElement)) {
          closeTopicMenu();
        }
      }, 0);
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!customTopic.contains(target)) {
        closeTopicMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeTopicMenu();
      }
    });
  }
}

const reviewsRotator = document.getElementById('reviews-rotator');

if (reviewsRotator) {
  const reviewSlides = Array.from(reviewsRotator.querySelectorAll('[data-review-slide]'));
  const reviewDots = Array.from(reviewsRotator.querySelectorAll('[data-review-dot]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeReviewIndex = reviewSlides.findIndex((slide) => slide.classList.contains('is-active'));
  let reviewIntervalId = 0;

  if (activeReviewIndex < 0) {
    activeReviewIndex = 0;
  }

  function setActiveReview(nextIndex) {
    if (reviewSlides.length === 0) {
      return;
    }
    const normalizedIndex = ((nextIndex % reviewSlides.length) + reviewSlides.length) % reviewSlides.length;
    activeReviewIndex = normalizedIndex;

    reviewSlides.forEach((slide, index) => {
      const isActive = index === normalizedIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    reviewDots.forEach((dot, index) => {
      const isActive = index === normalizedIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  }

  function stopReviewRotation() {
    if (reviewIntervalId) {
      window.clearInterval(reviewIntervalId);
      reviewIntervalId = 0;
    }
  }

  function advanceReview() {
    setActiveReview(activeReviewIndex + 1);
  }

  function startReviewRotation() {
    if (prefersReducedMotion.matches || reviewSlides.length < 2) {
      return;
    }
    stopReviewRotation();
    reviewIntervalId = window.setInterval(advanceReview, 6800);
  }

  if (reviewSlides.length > 0) {
    setActiveReview(activeReviewIndex);
  }

  reviewDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setActiveReview(index);
      startReviewRotation();
    });
  });

  reviewsRotator.addEventListener('mouseenter', stopReviewRotation);
  reviewsRotator.addEventListener('mouseleave', startReviewRotation);
  reviewsRotator.addEventListener('focusin', stopReviewRotation);
  reviewsRotator.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!reviewsRotator.contains(document.activeElement)) {
        startReviewRotation();
      }
    }, 0);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopReviewRotation();
      return;
    }
    startReviewRotation();
  });

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', () => {
      if (prefersReducedMotion.matches) {
        stopReviewRotation();
        return;
      }
      startReviewRotation();
    });
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener((event) => {
      if (event.matches) {
        stopReviewRotation();
        return;
      }
      startReviewRotation();
    });
  }

  startReviewRotation();
}

// cspell:ignore iPhone MacBook PlayStation Xbox Inspiron oneplus thinkpad allinone
const modernQuoteForm = document.getElementById('modern-quote-form');

if (modernQuoteForm) {
  const deviceGrid = document.getElementById('quote-device-grid');
  const modelGrid = document.getElementById('quote-model-grid');
  const issueGrid = document.getElementById('quote-issue-grid');
  const modelCustomWrap = document.getElementById('quote-model-custom-wrap');
  const modelCustomInput = document.getElementById('quote-model-custom');
  const issueCustomWrap = document.getElementById('quote-issue-custom-wrap');
  const issueCustomInput = document.getElementById('quote-issue-custom');
  const panels = Array.from(modernQuoteForm.querySelectorAll('[data-step-panel]'));
  const indicators = Array.from(document.querySelectorAll('[data-step-indicator]'));
  const backBtn = document.getElementById('quote-back-btn');
  const nextBtn = document.getElementById('quote-next-btn');
  const submitBtn = document.getElementById('quote-submit-btn');
  const submitStatus = document.getElementById('quote-submit-status');

  const hiddenDeviceName = document.getElementById('quote-hidden-device-name');
  const hiddenDeviceId = document.getElementById('quote-hidden-device-id');
  const hiddenModelName = document.getElementById('quote-hidden-model-name');
  const hiddenIssueName = document.getElementById('quote-hidden-issue-name');
  const hiddenModelId = document.getElementById('quote-hidden-model-id');
  const hiddenIssueId = document.getElementById('quote-hidden-issue-id');
  const hiddenModelInput = document.getElementById('quote-hidden-model-input');

  const reviewDevice = document.getElementById('quote-review-device');
  const reviewModel = document.getElementById('quote-review-model');
  const reviewIssue = document.getElementById('quote-review-issue');
  const reviewMedium = document.getElementById('quote-review-medium');

  const quoteImageBase = 'assets/images/quote-widget';
  const issueCatalog = {
    screen_damage: { key: 'screen-damage', label: 'Screen Damage' },
    battery_issue: { key: 'battery-issue', label: 'Battery Issue' },
    charging_port_issue: { key: 'charging-port-issue', label: 'Charging Port Issue' },
    back_glass_damage: { key: 'back-glass-damage', label: 'Back Glass Damage' },
    camera_issue: { key: 'camera-issue', label: 'Camera Issue' },
    audio_issue: { key: 'audio-issue', label: 'Audio Issue' },
    digitizer_touch_issue: { key: 'digitizer-touch-issue', label: 'Digitizer/Touch Issue' },
    software_issue: { key: 'software-issue', label: 'Software Issue' },
    no_power: { key: 'no-power', label: 'No Power' },
    keyboard_issue: { key: 'keyboard-issue', label: 'Keyboard Issue' },
    generic_screen_issue: { key: 'generic-screen-issue', label: 'Screen Issue' },
    generic_charging_issue: { key: 'generic-charging-issue', label: 'Charging Issue' },
    overheating: { key: 'overheating', label: 'Overheating' },
    hdmi_port_issue: { key: 'hdmi-port-issue', label: 'HDMI Port Issue' },
    disc_drive_issue: { key: 'disc-drive-issue', label: 'Disc Drive Issue' },
    controller_sync_issue: { key: 'controller-sync-issue', label: 'Controller Sync Issue' },
    no_display: { key: 'no-display', label: 'No Display' },
    storage_boot_issue: { key: 'storage-boot-issue', label: 'Storage/Boot Issue' },
    upgrade_build_service: { key: 'upgrade-build-service', label: 'Upgrade/Build Service' },
    general_diagnostic: { key: 'general-diagnostic', label: 'General Diagnostic' },
    connectivity_issue: { key: 'connectivity-issue', label: 'Connectivity Issue' },
    other_issue: { key: 'other-issue', label: '? Other Issue', other: true },
  };

  function imagePath(type, key) {
    return `${quoteImageBase}/${type}/${key}.svg`;
  }

  const quoteData = {
    devices: [
      { id: '1', key: 'iphone', label: 'iPhone', image: imagePath('devices', 'iphone') },
      { id: '2', key: 'android', label: 'Android Phone', image: imagePath('devices', 'android') },
      { id: '6', key: 'tablet', label: 'Tablet', image: imagePath('devices', 'tablet') },
      { id: '4', key: 'laptop', label: 'Laptop', image: imagePath('devices', 'laptop') },
      { id: '5', key: 'console', label: 'Gaming Console', image: imagePath('devices', 'console') },
      { id: '13', key: 'desktop', label: 'Desktop Services', image: imagePath('devices', 'desktop') },
      { id: '12', key: 'other', label: 'Other', image: imagePath('devices', 'other') },
    ],
    models: {
      iphone: [
        { key: 'iphone-11', label: 'iPhone 11' },
        { key: 'iphone-12', label: 'iPhone 12' },
        { key: 'iphone-13', label: 'iPhone 13' },
        { key: 'iphone-14', label: 'iPhone 14' },
        { key: 'iphone-15', label: 'iPhone 15' },
        { key: 'iphone-other', label: '? Other iPhone Model', other: true },
      ],
      android: [
        { key: 'android-samsung-s', label: 'Samsung Galaxy S Series' },
        { key: 'android-samsung-a', label: 'Samsung Galaxy A Series' },
        { key: 'android-pixel', label: 'Google Pixel' },
        { key: 'android-motorola', label: 'Motorola' },
        { key: 'android-oneplus', label: 'OnePlus' },
        { key: 'android-other', label: '? Other Android Model', other: true },
      ],
      tablet: [
        { key: 'tablet-ipad', label: 'iPad' },
        { key: 'tablet-ipad-air', label: 'iPad Air' },
        { key: 'tablet-ipad-pro', label: 'iPad Pro' },
        { key: 'tablet-galaxy-tab', label: 'Samsung Galaxy Tab' },
        { key: 'tablet-fire', label: 'Amazon Fire Tablet' },
        { key: 'tablet-other', label: '? Other Tablet', other: true },
      ],
      laptop: [
        { key: 'laptop-macbook-air', label: 'MacBook Air' },
        { key: 'laptop-macbook-pro', label: 'MacBook Pro' },
        { key: 'laptop-dell-inspiron', label: 'Dell Inspiron' },
        { key: 'laptop-hp-pavilion', label: 'HP Pavilion' },
        { key: 'laptop-lenovo-thinkpad', label: 'Lenovo ThinkPad' },
        { key: 'laptop-other', label: '? Other Laptop', other: true },
      ],
      console: [
        { key: 'console-ps5', label: 'PlayStation 5' },
        { key: 'console-ps4', label: 'PlayStation 4' },
        { key: 'console-xbox-series', label: 'Xbox Series X/S' },
        { key: 'console-xbox-one', label: 'Xbox One' },
        { key: 'console-switch', label: 'Nintendo Switch' },
        { key: 'console-other', label: '? Other Console', other: true },
      ],
      desktop: [
        { key: 'desktop-custom', label: 'Custom Desktop' },
        { key: 'desktop-dell', label: 'Dell Desktop' },
        { key: 'desktop-hp', label: 'HP Desktop' },
        { key: 'desktop-allinone', label: 'All-in-One PC' },
        { key: 'desktop-gaming', label: 'Gaming PC' },
        { key: 'desktop-other', label: '? Other Desktop', other: true },
      ],
      other: [{ key: 'other-custom-model', label: '? Other Device / Model', other: true }],
    },
    issues: {
      iphone: [
        issueCatalog.screen_damage,
        issueCatalog.battery_issue,
        issueCatalog.charging_port_issue,
        issueCatalog.back_glass_damage,
        issueCatalog.camera_issue,
        issueCatalog.other_issue,
      ],
      android: [
        issueCatalog.screen_damage,
        issueCatalog.battery_issue,
        issueCatalog.charging_port_issue,
        issueCatalog.audio_issue,
        issueCatalog.camera_issue,
        issueCatalog.other_issue,
      ],
      tablet: [
        issueCatalog.screen_damage,
        issueCatalog.generic_charging_issue,
        issueCatalog.battery_issue,
        issueCatalog.digitizer_touch_issue,
        issueCatalog.software_issue,
        issueCatalog.other_issue,
      ],
      laptop: [
        issueCatalog.no_power,
        issueCatalog.keyboard_issue,
        issueCatalog.generic_screen_issue,
        issueCatalog.generic_charging_issue,
        issueCatalog.overheating,
        issueCatalog.other_issue,
      ],
      console: [
        issueCatalog.hdmi_port_issue,
        issueCatalog.no_power,
        issueCatalog.disc_drive_issue,
        issueCatalog.overheating,
        issueCatalog.controller_sync_issue,
        issueCatalog.other_issue,
      ],
      desktop: [
        issueCatalog.no_power,
        issueCatalog.no_display,
        issueCatalog.storage_boot_issue,
        issueCatalog.overheating,
        issueCatalog.upgrade_build_service,
        issueCatalog.other_issue,
      ],
      other: [
        issueCatalog.general_diagnostic,
        issueCatalog.no_power,
        issueCatalog.software_issue,
        issueCatalog.connectivity_issue,
        issueCatalog.other_issue,
      ],
    },
  };

  const state = {
    step: 1,
    device: null,
    model: null,
    modelCustom: '',
    issues: [],
    issueCustom: '',
  };

  function makeChoiceButton({ label, image, group, key, isOther = false }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quote-choice';
    button.dataset.group = group;
    button.dataset.value = label;
    button.dataset.key = key;
    button.dataset.other = String(isOther);
    button.innerHTML = `
      <span class="quote-choice-media"><img src="${image}" alt="" loading="lazy" /></span>
      <span class="quote-choice-label">${label}</span>
    `;
    if (isOther) {
      button.classList.add('quote-choice-other');
    }
    return button;
  }

  function renderDevices() {
    deviceGrid.textContent = '';
    quoteData.devices.forEach((device) => {
      const button = makeChoiceButton({
        label: device.label,
        image: device.image,
        group: 'device',
        key: device.key,
        isOther: device.key === 'other',
      });
      if (state.device?.key === device.key) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        state.device = device;
        state.model = null;
        state.modelCustom = '';
        state.issues = [];
        state.issueCustom = '';
        renderDevices();
        renderModels();
        renderIssues();
        goToStep(2);
      });
      deviceGrid.appendChild(button);
    });
  }

  function renderModels() {
    modelGrid.textContent = '';
    const modelList = state.device ? quoteData.models[state.device.key] || [] : [];
    modelList.forEach((model, index) => {
      const isOther = Boolean(model.other);
      const image = imagePath('models', model.key);
      const button = makeChoiceButton({ label: model.label, image, group: 'model', key: model.key, isOther });
      if (state.model?.key === model.key) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        state.model = { ...model, id: isOther ? '000' : String(index + 1) };
        if (!isOther) {
          state.modelCustom = '';
          modelCustomInput.value = '';
        }
        modelCustomWrap.hidden = !isOther;
        if (isOther) {
          modelCustomInput.focus();
        }
        renderModels();
        renderIssues();
      });
      modelGrid.appendChild(button);
    });
    modelCustomWrap.hidden = !(state.model && state.model.other);
  }

  function renderIssues() {
    issueGrid.textContent = '';
    const issueList = state.device ? quoteData.issues[state.device.key] || [] : [];
    issueList.forEach((issue, index) => {
      const isOther = Boolean(issue.other);
      const image = imagePath('issues', issue.key);
      const button = makeChoiceButton({ label: issue.label, image, group: 'issue', key: issue.key, isOther });
      if (state.issues.some((currentIssue) => currentIssue.key === issue.key)) {
        button.classList.add('is-selected');
      }
      button.addEventListener('click', () => {
        const exists = state.issues.some((currentIssue) => currentIssue.key === issue.key);
        if (exists) {
          state.issues = state.issues.filter((currentIssue) => currentIssue.key !== issue.key);
          if (isOther) {
            state.issueCustom = '';
            issueCustomInput.value = '';
          }
        } else {
          state.issues.push({ ...issue, id: isOther ? '000' : String(index + 1) });
        }
        issueCustomWrap.hidden = !state.issues.some((currentIssue) => currentIssue.other);
        if (!issueCustomWrap.hidden) {
          issueCustomInput.focus();
        }
        renderIssues();
      });
      issueGrid.appendChild(button);
    });
    issueCustomWrap.hidden = !state.issues.some((currentIssue) => currentIssue.other);
  }

  function goToStep(nextStep) {
    state.step = Math.min(5, Math.max(1, nextStep));
    panels.forEach((panel, index) => {
      const isActive = index + 1 === state.step;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
    });
    indicators.forEach((indicator, index) => {
      const indicatorStep = index + 1;
      indicator.classList.toggle('is-active', indicatorStep === state.step);
      indicator.classList.toggle('is-done', indicatorStep < state.step);
    });
    backBtn.disabled = state.step === 1;
    nextBtn.hidden = state.step === 5;
    submitBtn.hidden = state.step !== 5;
  }

  function validateStep(step) {
    if (step === 1) {
      return Boolean(state.device);
    }
    if (step === 2) {
      if (!state.model) {
        return false;
      }
      if (state.model.other) {
        state.modelCustom = modelCustomInput.value.trim();
        return state.modelCustom.length > 1;
      }
      return true;
    }
    if (step === 3) {
      if (state.issues.length === 0) {
        return false;
      }
      if (state.issues.some((issue) => issue.other)) {
        state.issueCustom = issueCustomInput.value.trim();
        return state.issueCustom.length > 1;
      }
      return true;
    }
    if (step === 4) {
      const requiredFields = [
        document.getElementById('quote-name'),
        document.getElementById('quote-email'),
        document.getElementById('quote-phone'),
      ];
      return requiredFields.every((field) => field && field.checkValidity());
    }
    return true;
  }

  function showValidationMessage(step) {
    if (step === 4) {
      modernQuoteForm.reportValidity();
      return;
    }
    if (step === 2 && state.model && state.model.other) {
      modelCustomInput.focus();
      return;
    }
    if (step === 3 && state.issues.some((issue) => issue.other)) {
      issueCustomInput.focus();
      return;
    }
    submitStatus.hidden = false;
    submitStatus.textContent = 'Please complete this step before continuing.';
  }

  function updateReview() {
    const selectedMedium = modernQuoteForm.querySelector('input[name="medium"]:checked');
    const modelDisplay = state.model?.other ? state.modelCustom : state.model?.label || '-';
    const issueLabels = state.issues.map((issue) => (issue.other ? state.issueCustom : issue.label)).filter(Boolean);

    reviewDevice.textContent = state.device ? state.device.label : '-';
    reviewModel.textContent = modelDisplay || '-';
    reviewIssue.textContent = issueLabels.join(', ') || '-';
    reviewMedium.textContent = selectedMedium ? selectedMedium.parentElement.textContent.trim() : '-';
  }

  function syncHiddenFields() {
    const modelLabel = state.model?.other ? state.modelCustom : state.model?.label || '';
    const issueLabel = state.issues
      .map((issue) => (issue.other ? state.issueCustom : issue.label))
      .filter(Boolean)
      .join(', ');
    const issueIds = state.issues.map((issue) => issue.id).join(',');

    hiddenDeviceName.value = state.device ? state.device.label : '';
    hiddenDeviceId.value = state.device ? state.device.id : '';
    hiddenModelName.value = modelLabel;
    hiddenIssueName.value = issueLabel;
    hiddenModelId.value = state.model ? state.model.id : '000';
    hiddenIssueId.value = issueIds || '000';
    hiddenModelInput.value = state.modelCustom || modelLabel;
  }

  function nextStep() {
    submitStatus.hidden = true;
    if (!validateStep(state.step)) {
      showValidationMessage(state.step);
      return;
    }
    if (state.step === 4) {
      updateReview();
    }
    goToStep(state.step + 1);
  }

  backBtn.addEventListener('click', () => {
    submitStatus.hidden = true;
    goToStep(state.step - 1);
  });

  nextBtn.addEventListener('click', nextStep);

  modelCustomInput.addEventListener('input', () => {
    state.modelCustom = modelCustomInput.value.trim();
  });

  issueCustomInput.addEventListener('input', () => {
    state.issueCustom = issueCustomInput.value.trim();
  });

  modernQuoteForm.addEventListener('submit', (event) => {
    if (state.step !== 5) {
      event.preventDefault();
      return;
    }
    syncHiddenFields();
    submitStatus.hidden = false;
    submitStatus.textContent = 'Submitting quote request...';
  });

  const submitFrame = document.querySelector('iframe[name="modern-quote-submit-frame"]');
  submitFrame?.addEventListener('load', () => {
    submitStatus.hidden = false;
    submitStatus.textContent = 'Quote request submitted. Our team will follow up shortly.';
  });

  renderDevices();
  renderModels();
  renderIssues();
  goToStep(1);
}
