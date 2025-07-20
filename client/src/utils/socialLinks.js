export const socialLinks = {
  facebook: "https://facebook.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  youtube: "https://youtube.com"
};

export const externalLinks = {
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  help: "/help"
};

export const handleSocialClick = (platform) => {
  window.location.reload();
  console.log(`${platform} link clicked - page refreshed`);
}; 