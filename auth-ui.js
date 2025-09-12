/* auth-ui.js */

// رابط العودة بعد تسجيل الدخول
const REDIRECT = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}account.html`;

// الحصول على المستخدم المخزن محلياً
function getUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// التحقق من وجود جلسة وإلا إعادة التوجيه لصفحة الدخول
async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const base = location.pathname.replace(/[^/]+$/, '');
    location.href = `${base}auth.html`;
  }
  return session;
}

// تحديث رابط الحساب في الهيدر بحسب حالة الجلسة
async function updateAuthLink() {
  const link = document.getElementById('authLink');
  if (!link) return;
  const { data: { session } } = await supabase.auth.getSession();
  const base = location.pathname.replace(/[^/]+$/, '');
  link.href = session ? `${base}account.html` : `${base}auth.html`;
}

// إرسال رمز التحقق إلى البريد
async function sendOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: REDIRECT }
  });
  if (error) throw error;
}

// التحقق من رمز OTP وتسجيل الدخول
async function verifyOtp(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  });
  if (error) throw error;
  return data;
}

// تسجيل الدخول باستخدام جوجل
async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: REDIRECT,
      queryParams: { access_type: 'offline', prompt: 'consent' }
    }
  });
  if (error) throw error;
}


// ربط عناصر الواجهة بعد تحميل الصفحة
addEventListener('DOMContentLoaded', () => {
  updateAuthLink();

  if (typeof supabase !== 'undefined') {
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        if (location.pathname.endsWith('auth.html')) {
          location.href = REDIRECT;
        }
      } else {
        localStorage.removeItem('user');
      }
      updateAuthLink();
    });
  }

  const emailInput = document.getElementById('loginEmail');
  const otpInput   = document.getElementById('otpCode');
  const sendBtn    = document.getElementById('sendOtpBtn');
  const verifyBtn  = document.getElementById('verifyOtpBtn');
  const googleBtn  = document.getElementById('googleBtn');
  const logoutBtn  = document.getElementById('logoutBtn');

  if (sendBtn) {
    sendBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = (emailInput?.value || '').trim();
      if (!email) return alert('اكتب بريدك الإلكتروني');
      sendBtn.disabled = true;
      try {
        await sendOtp(email);
        alert('تم إرسال رمز التحقق إلى بريدك.');
      } catch (err) {
        alert('فشل إرسال الرمز: ' + err.message);
      } finally {
        sendBtn.disabled = false;
      }
    });
  }

  if (verifyBtn) {
    verifyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = (emailInput?.value || '').trim();
      const code  = (otpInput?.value || '').trim();
      if (!email || !code) return alert('أدخل البريد والرمز.');
      verifyBtn.disabled = true;
      try {
        const { user } = await verifyOtp(email, code);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        location.href = REDIRECT;
      } catch (err) {
        alert('رمز غير صالح: ' + err.message);
      } finally {
        verifyBtn.disabled = false;
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await loginWithGoogle();
      } catch (err) {
        alert('فشل تسجيل الدخول بجوجل: ' + err.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      const base = location.pathname.replace(/[^/]+$/, '');
      location.href = `${base}auth.html`;
    });
  }
});
