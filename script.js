"use strict";

const canonicalHref = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
const baseUrl = canonicalHref.endsWith("/") ? canonicalHref : `${canonicalHref}/`;
const pageDescription = document.querySelector('meta[name="description"]')?.content || "";
const businessEmail = "Info@electroderepairs.com";
const businessPhone = "+1-405-268-6305";
const businessAddress = {
  "@type": "PostalAddress",
  streetAddress: "1025 N Main St",
  addressLocality: "Newcastle",
  addressRegion: "OK",
  postalCode: "73065",
  addressCountry: "US"
};
const businessHours = [
  "Tu 10:00-18:00",
  "We 10:00-18:00",
  "Th 10:00-18:00",
  "Fr 10:00-18:00",
  "Sa 10:00-18:00"
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Electrode Repairs",
  description: pageDescription,
  url: canonicalHref,
  telephone: businessPhone,
  email: businessEmail,
  image: new URL("assets/images/building_front.jpg", baseUrl).toString(),
  logo: new URL("assets/images/logo.png", baseUrl).toString(),
  address: businessAddress,
  openingHours: businessHours,
  areaServed: "Newcastle, OK",
  sameAs: [
    "https://www.instagram.com/electrode_repairs/",
    "https://www.facebook.com/ElectrodeRepairs"
  ]
};

const existingStructuredDataScript = document.getElementById("local-business-jsonld");
if (existingStructuredDataScript) {
  existingStructuredDataScript.remove();
}

const structuredDataScript = document.createElement("script");
structuredDataScript.id = "local-business-jsonld";
structuredDataScript.type = "application/ld+json";
structuredDataScript.text = JSON.stringify(structuredData);
document.head.appendChild(structuredDataScript);

const emailTrigger = document.getElementById("email-trigger");
const emailMenu = document.getElementById("email-menu");
const copyEmailButton = document.getElementById("copy-email-btn");

function showEmailToast(message) {
  let toast = document.querySelector(".email-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "email-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showEmailToast.timeoutId);
  showEmailToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1700);
}

function closeEmailMenu() {
  if (!emailTrigger || !emailMenu) {
    return;
  }
  emailMenu.hidden = true;
  emailTrigger.setAttribute("aria-expanded", "false");
}

if (emailTrigger && emailMenu && copyEmailButton) {
  emailTrigger.addEventListener("click", () => {
    const menuIsOpen = !emailMenu.hidden;
    emailMenu.hidden = menuIsOpen;
    emailTrigger.setAttribute("aria-expanded", String(!menuIsOpen));
  });

  copyEmailButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(businessEmail);
      showEmailToast("Copied to clipboard");
    } catch {
      showEmailToast("Copy failed. Opening mail app...");
      window.location.href = `mailto:${businessEmail}`;
    }
    closeEmailMenu();
  });

  emailMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains("email-option")) {
      closeEmailMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (
      target instanceof Node &&
      !emailMenu.contains(target) &&
      !emailTrigger.contains(target)
    ) {
      closeEmailMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeEmailMenu();
    }
  });
}
