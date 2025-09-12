}
<!-- يجب أن يكون sdk تحت قبل auth-ui.js -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config/supabase.js"></script>
<script>
/* ====== إعدادات أساسية ====== */
// تأكد أن supabase مُعرَّف من config/supabase.js:
// window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

/* رابط الرجوع بعد الدخول */
const REDIRECT = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}account.html`;

/* تحديث رابط الحساب بالأعلى */
async function updateAuthLink() {
  const a = document.getElementById('authLink');
  if (!a) return;
  const { data: { session } } = await supabase.auth.getSession();
  const base = location.pathname.replace(/[^/]+$/, '');
  a.href = session ? `${base}account.html` : `${base}auth.html`;
}

/* إرسال رمز OTP للبريد */
async function sendOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: REDIRECT }
  });
  if (error) throw error;
}

/* التحقق من رمز OTP (الأرقام التي تصلك على البريد) */
async function verifyOtp(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'   // مهم: OTP للبريد
  });
  if (error) throw error;
  return data;
}

/* تسجيل الدخول بجوجل */
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

/* ربط الأحداث */
document.addEventListener('DOMContentLoaded', () => {
  updateAuthLink();

  const emailInput = document.getElementById('loginEmail');
  const otpInput   = document.getElementById('otpCode');
  const sendBtn    = document.getElementById('sendOtpBtn');
  const verifyBtn  = document.getElementById('verifyOtpBtn');
  const googleBtn  = document.getElementById('googleBtn');

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
        await verifyOtp(email, code);
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
        await loginWithGoogle(); // سيحوّل تلقائياً
      } catch (err) {
        alert('فشل تسجيل الدخول بجوجل: ' + err.message);
      }
    });
  }
});
</script>
