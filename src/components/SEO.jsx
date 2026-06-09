import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
  useEffect(() => {
    // 1. Update Title
    const brandSuffix = 'Derma Secret';
    const finalTitle = title ? `${title} | ${brandSuffix}` : `Derma Secret - Clinical Skincare Store`;
    document.title = finalTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (attributeName, attributeValue, content) => {
      if (content === undefined || content === null) return;
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Description
    updateMetaTag('name', 'description', description || 'Science-backed dermatological formulations for healthy, radiant skin.');

    // 3. Update Keywords
    updateMetaTag('name', 'keywords', keywords || 'skincare, dermatologist, clinical, acne, sun protection, skin care, products');

    // 4. Update Open Graph Tags
    updateMetaTag('property', 'og:title', title || 'Derma Secret - Clinical Skincare Store');
    updateMetaTag('property', 'og:description', description || 'Science-backed dermatological formulations for healthy, radiant skin.');
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:url', url || window.location.href);
    if (image) {
      updateMetaTag('property', 'og:image', image);
    }

    // 5. Update Twitter Tags
    updateMetaTag('name', 'twitter:title', title || 'Derma Secret - Clinical Skincare Store');
    updateMetaTag('name', 'twitter:description', description || 'Science-backed dermatological formulations for healthy, radiant skin.');
    if (image) {
      updateMetaTag('name', 'twitter:image', image);
    }
    updateMetaTag('name', 'twitter:card', 'summary_large_image');

  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything visually
};

export default SEO;
