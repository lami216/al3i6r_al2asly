function getUser(){
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    return null;
  }
}

function isLoggedIn(){
  return !!getUser();
}

function updateAuthLink(){
  const container = document.querySelector('header .flex.items-center.gap-4');
  if(container && !document.getElementById('authLink')){
    const link = document.createElement('a');
    link.id = 'authLink';
    link.className = 'text-white';
    link.innerHTML = '<i class="fas fa-user text-2xl"></i>';
    container.insertBefore(link, container.firstChild);
  }
  const link = document.getElementById('authLink');
  if(!link) return;
  link.href = isLoggedIn() ? 'account.html' : 'auth.html';
}

function logout(){
  localStorage.removeItem('user');
  updateAuthLink();
}

function requireAuth(){
  if(!isLoggedIn()){
    alert('يرجى تسجيل الدخول أولاً');
    window.location.href = 'auth.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthLink();

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');
  if(showSignup) showSignup.addEventListener('click', e => { e.preventDefault(); loginForm.classList.add('hidden'); signupForm.classList.remove('hidden'); });
  if(showLogin) showLogin.addEventListener('click', e => { e.preventDefault(); signupForm.classList.add('hidden'); loginForm.classList.remove('hidden'); });
  if(loginForm) loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm.querySelector('#loginEmail').value;
    localStorage.setItem('user', JSON.stringify({email}));
    window.location.href = 'account.html';
  });
  if(signupForm) signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = signupForm.querySelector('#signupEmail').value;
    localStorage.setItem('user', JSON.stringify({email}));
    window.location.href = 'account.html';
  });
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', () => { logout(); window.location.href = 'index.html'; });
});

function handleGoogleSignIn(response){
  try {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    localStorage.setItem('user', JSON.stringify({email: payload.email, name: payload.name}));
    window.location.href = 'account.html';
  } catch (err) {
    console.error('Google sign-in failed', err);
  }
}
