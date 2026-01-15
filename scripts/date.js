document.addEventListener('DOMContentLoaded', () => {

  const currentYear = new Date().getFullYear();
  document.getElementById('currentyear').textContent = currentYear;

 
  const lastMod = document.lastModified;
  document.getElementById('lastModified').textContent = `Last modified: ${lastMod}`;
});