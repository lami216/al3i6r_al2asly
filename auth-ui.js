<!-- /auth-ui.js -->
<script>
/* ===== Helpers ===== */
const BASE = location.pathname.split('/').slice(0,2).join('/');      // "/al3i6r_al2asly"
const SITE_URL = location.origin + BASE;                              // "https://…/al3i6r_al2asly"
const to = p => `${SITE_URL}/${p}`.replace(/([^:]\/)\/+/g,'$1');      // join

async function getSession(){
  const { data:{ session } } = await supabase.auth.getSession();
  return session || null;
}

function injectAuthLink(){
  const wrap = document.querySelector('header .flex.items-center.gap-4');
  if(!wrap || document.getElementById('authLink')) return;
  const a = document.createElement('a');
  a.id = 'authLink';
  a.className = 'text-white';
  a.innerHTML = '<i class="fas fa-user text-2xl"></i>';
  wrap.insertBefore(a, wrap.firstChild);
}

async function updateAuthLink(){
  injectAuthLink();
  const a = document.getElementById('authLink');
  if(!a) return;
  const session = await getSession();
  a.href = session ? to('account.html') : to('auth.html');
}

/* ===== Require auth on protected pages (optional) ===== */
async function requireAuth(){
  const session = await getSession();
  if(!session){
    alert('يُرجى تسجيل الدخول أولاً');
    location.href = to('auth.html');
  }
}

/* ===== Logout binder (if موجود الزر) ===== */
function bindLogout(){
  const btn = document.getElementById('logoutButton');
  if(!btn) return;
  btn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    location.href = to('auth.html');
  });
}

/* ===== Google Sign-in (زر داخل auth.html) ===== */
function bindGoogle(){
  const btn = document.getElementById('googleBtn');
  if(!btn) return;
  btn.addEventListener('click', async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: to('account.html') }
    });
  });
}

/* ===== Email OTP flow (الأزرار داخل auth.html) ===== */
function bindEmailOtp(){
  const sendBtn = document.getElementById('sendOtpBtn');
  const verifyBtn = document.getElementById('verifyOtpBtn');
  const msg = (t, ok=false) => {
    const el = document.getElementById('authMsg');
    if(el){ el.textContent = t; el.className = ok ? 'text-green-600' : 'text-red-600'; }
  };

  if(sendBtn){
    sendBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('emailInput').value.trim();
      if(!email){ msg('أدخل البريد الإلكتروني'); return; }
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: to('auth.html') }   // آمن لـ GH Pages
      });
      if(error) msg(error.message);
      else msg('تم إرسال الرمز إلى بريدك 👍', true);
    });
  }

  if(verifyBtn){
    verifyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('emailInput').value.trim();
      const token = document.getElementById('otpInput').value.trim();
      if(!email || !token){ msg('أدخل البريد والرمز'); return; }

      // ملاحظة: بعض المشاريع تحتاج type:'email' أو 'magiclink' حسب إعداد Supabase Email OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email, token, type: 'email'
      });

      if(error) msg(error.message);
      else { msg('تم تسجيل الدخول', true); location.href = to('account.html'); }
    });
  }
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', async () => {
  await updateAuthLink();
  bindLogout();
  bindGoogle();
  bindEmailOtp();

  // حدّث رابط الحساب عند تغيّر حالة الجلسة
  supabase.auth.onAuthStateChange(() => updateAuthLink());
});

// تعريض الدالة لو احتجتها بصفحات معيّنة
window.requireAuth = requireAuth;
</script>
