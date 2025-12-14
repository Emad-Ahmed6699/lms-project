// Main JS for auth pages: dark mode & password toggle
(function(){
  function togglePassword(id, btn){
    const input = document.getElementById(id);
    if(!input) return;
    if(input.type === 'password'){
      input.type = 'text';
      btn.setAttribute('aria-pressed','true');
    } else {
      input.type = 'password';
      btn.setAttribute('aria-pressed','false');
    }
  }

  function initDarkMode(){
    const btn = document.querySelector('.dark-mode-toggle');
    const current = localStorage.getItem('yalla-dark');
    if(current === '1') document.body.classList.add('dark');
    if(!btn) return;
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('yalla-dark', isDark ? '1' : '0');
      btn.textContent = isDark ? '☀️' : '🌙';
    });
  }

  // Expose togglePassword globally for inline onclick handlers
  window.togglePassword = togglePassword;
  document.addEventListener('DOMContentLoaded', initDarkMode);
})();
