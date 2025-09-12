/* global supabase */

function $(id){ return document.getElementById(id); }
const q = sel => document.querySelector(sel);

// تبويب النماذج
const forms = {
  signIn: $('formSignIn'),
  signUp: $('formSignUp'),
  otp: $('formOtp'),
};
const tabs = {
  signIn: $('tabSignIn'),
  signUp: $('tabSignUp'),
  otp: $('tabOtp'),
};

function showForm(name){
  Object.values(forms).forEach(f => f.classList.add('hidden'));
  forms[name].classList.remove('hidden');
  // تلوين التبويب
  Object.entries(tabs).forEach(([k,btn])=>{
    btn.classList.toggle('bg-white', k===name);
    btn.classList.toggle('text-yellow-700', k===name);
    btn.classList.toggle('font-semibold', k===name);
    btn.classList.toggle('bg-yellow-50', k!==name);
  });
}

['signIn','signUp','otp'].forEach(name => {
  tabs[name]?.addEventListener('click', ()=>showForm(name));
});
showForm('signIn'); // الافتراضي

// حدث “تسجيل خروج” عام
function attachLogout(){
  const logoutBtn = q('[data-logout]');
  if (logoutBtn){
    logoutBtn.addEventListener('click', async ()=>{
      await supabase.auth.signOut();
      localStorage.removeItem('user'); // تنظيف أي بقايا قديمة
      location.href = 'auth.html';
    });
  }
}

// تحديث رابط الهيدر (تبديل تسجيل/حسابي)
async function updateAuthLink(){
  const { data: { user } } = await supabase.auth.getUser();
  const container = document.querySelector('header nav');
  if(!container) return;
  let link = $('authLink');
  if(!link){
    link = document.createElement('a');
    link.id = 'authLink';
    container.appendChild(link);
  }
  link.className = 'text-white';
  if(user){
    link.href = 'account.html';
    link.innerHTML = '<i class="fa-regular fa-user text-xl"></i>';
  }else{
    link.href = 'auth.html';
    link.innerHTML = '<i class="fa-regular fa-user text-xl"></i>';
  }
}

// ========== تسجيل الدخول بكلمة مرور ==========
forms.signIn?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  $('siMsg').textContent = '...جاري تسجيل الدخول';
  const email = $('siEmail').value.trim();
  const password = $('siPassword').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if(error){
    $('siMsg').textContent = 'خطأ: ' + (error.message || 'تعذر تسجيل الدخول');
    return;
  }
  $('siMsg').textContent = 'تم الدخول ✔';
  location.href = 'account.html';
});

// إعادة تعيين كلمة المرور عبر رابط
$('btnReset')?.addEventListener('click', async (e)=>{
  e.preventDefault();
  const email = prompt('أدخل بريدك الإلكتروني لتلقي رابط إعادة التعيين:');
  if(!email) return;
  const redirectTo = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}account.html`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  alert(error ? ('فشل: ' + error.message) : 'تم إرسال الرابط (تفقد بريدك)');
});

// ========== إنشاء حساب بكلمة مرور ==========
forms.signUp?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  $('suMsg').textContent = '...جاري إنشاء الحساب';
  const email = $('suEmail').value.trim();
  const password = $('suPassword').value;
  const full_name = $('suName').value.trim();
  const phone = $('suPhone').value.trim();

  const redirectTo = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}account.html`;
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: {
      emailRedirectTo: redirectTo,
      data: { full_name, phone }
    }
  });

  if(error){
    $('suMsg').textContent = 'خطأ: ' + (error.message || 'تعذر إنشاء الحساب');
    return;
  }
  $('suMsg').textContent = 'تم إنشاء الحساب! تحقق من بريدك إن طُلب ذلك.';
  // في بعض الحالات يدخل مباشرة:
  if (data.user) location.href = 'account.html';
});

// ========== تسجيل دخول بواسطة OTP ==========
$('btnSendOtp')?.addEventListener('click', async ()=>{
  $('otpMsg').textContent = '...جارٍ إرسال الرمز';
  const email = $('otpEmail').value.trim();
  if(!email){ $('otpMsg').textContent = 'أدخل البريد أولًا'; return; }
  // ربط قالب البريد (الذي عدّلناه) سيُرسل الرمز {{.Token}}
  const { error } = await supabase.auth.signInWithOtp({ email });
  $('otpMsg').textContent = error ? ('فشل الإرسال: '+error.message) : 'تم إرسال الرمز، افحص بريدك ✉️';
});

// التحقق من الرمز اليدوي (OTP)
$('btnVerifyOtp')?.addEventListener('click', async ()=>{
  $('otpMsg').textContent = '...جارٍ التحقق';
  const email = $('otpEmail').value.trim();
  const token = $('otpCode').value.trim();
  if(!email || !token){ $('otpMsg').textContent = 'أدخل البريد والرمز'; return; }
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if(error){
    $('otpMsg').textContent = 'رمز غير صحيح: ' + error.message;
    return;
  }
  $('otpMsg').textContent = 'تم الدخول ✔';
  location.href = 'account.html';
});

// ========== جوجل (اختياري) ==========
$('btnGoogle')?.addEventListener('click', async ()=>{
  const redirectTo = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}account.html`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo }
  });
  if(error) alert('فشل جوجل: ' + error.message);
});

// استدعاءات عامة
document.addEventListener('DOMContentLoaded', ()=>{
  updateAuthLink();
  attachLogout();
});
