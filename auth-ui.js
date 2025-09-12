function $(id){return document.getElementById(id);} 

async function updateAuthLink(){
  const { data: { user } } = await supabase.auth.getUser();
  const link = $('authLink');
  if(!link) return;
  link.href = user ? 'account.html' : 'auth.html';
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthLink();
  supabase.auth.onAuthStateChange(() => updateAuthLink());

  $('sendOtpBtn')?.addEventListener('click', async () => {
    const email = $('loginEmail').value.trim();
    if(!email) return;
    const redirectTo = window.location.origin + window.location.pathname.replace(/[^/]+$/,'') + 'auth.html';
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options:{ emailRedirectTo: redirectTo }
    });
    alert(error ? error.message : 'تم إرسال الرمز إلى بريدك');
  });

  $('verifyOtpBtn')?.addEventListener('click', async () => {
    const email = $('loginEmail').value.trim();
    const token = $('otpCode').value.trim();
    if(!email || !token) return;
    const { error } = await supabase.auth.verifyOtp({ email, token, type:'email' });
    if(error){ alert(error.message); return; }
    location.href = 'account.html';
  });

  $('googleBtn')?.addEventListener('click', async () => {
    const redirectTo = window.location.origin + window.location.pathname.replace(/[^/]+$/,'') + 'auth.html';
    await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo }});
  });

  $('logoutButton')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    location.href = 'auth.html';
  });
});
