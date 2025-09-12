/* auth-ui.js */

// رابط العودة بعد تسجيل الدخول
const REDIRECT = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}account.html`;

// تحديث رابط الحساب في الهيدر بحسب حالة الجلسة
async function updateAuthLink() {
  const link = document.getElementById('authLink');
  if (!link) return;
  const { data: { session } } = await supabase.auth.getSession();
  const base = location.pathname.replace(/[^/]+$/, '');
  link.href = session ? `${base}account.html` : `${base}auth.html`;
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
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
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
      const token = (otpInput?.value || '').trim();
      if (!email || !token) return alert('أدخل البريد والرمز.');
      verifyBtn.disabled = true;
      try {
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
        if (error) throw error;
        localStorage.setItem('user', JSON.stringify(data.user));
        location.href = 'account.html';
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
});
