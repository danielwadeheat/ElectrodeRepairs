"use strict";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Electrode Repairs",
  url: "https://electroderepairs.com/",
  image: "https://electroderepairs.com/assets/images/building_front.jpg",
  logo: "https://electroderepairs.com/assets/images/logo.png",
  sameAs: [
    "https://www.instagram.com/electrode_repairs/",
    "https://www.facebook.com/ElectrodeRepairs"
  ]
};

const structuredDataScript = document.createElement("script");
structuredDataScript.type = "application/ld+json";
structuredDataScript.text = JSON.stringify(structuredData);
document.head.appendChild(structuredDataScript);
