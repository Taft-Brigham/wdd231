document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('seller-registration-form');
  if (!form) return;
  
  const desc = document.getElementById('description');
  const counter = document.getElementById('desc-count');
  
  if (desc && counter) {
    desc.addEventListener('input', () => {
      const len = desc.value.length;
      counter.textContent = len;
      counter.style.color = len < 50 ? '#DC2626' : len > 450 ? '#D97706' : '#047857';
    });
  }
  
  form.addEventListener('submit', (e) => {
    const timestamp = document.getElementById('timestamp');
    if (timestamp) timestamp.value = new Date().toISOString();
    
    const data = new FormData(form);
    const obj = {};
    data.forEach((v, k) => obj[k] = v);
    
    const subs = JSON.parse(localStorage.getItem('adnow_submissions') || '[]');
    subs.push({ ...obj, submittedAt: new Date().toISOString() });
    localStorage.setItem('adnow_submissions', JSON.stringify(subs));
  });
});