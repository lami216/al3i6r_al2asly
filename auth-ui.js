  // استرجاع بيانات المستخدم من localStorage (احتياطي)
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
}

// التحقق هل المستخدم مسجل دخول
function isLoggedIn() {
  return !!getUser();
}

// تحديث رابط الحساب في الهيدر
async function updateAuthLink() {
  const a = document.getElementById("authLink"); // الرابط مضاف يدوياً بالهيدر
  if (!a) return;

  // جلب السيشن من Supabase
  const { data: { session } } = await supabase.auth.getSession();

  const BASE = location.pathname.split("/").slice(0, 2).join("/");
  const SITE_URL = location.origin + BASE;
  const to = (p) => `${SITE_URL}/${p}`.replace(/([^:]\/)\/+/g, "$1");

  // إذا في سيشن -> حساب، إذا لا -> تسجيل دخول
  a.href = session ? to("account.html") : to("auth.html");
}

// تسجيل خروج
function logout() {
  localStorage.removeItem("user");
  supabase.auth.signOut();
  updateAuthLink();
}

// فرض تسجيل الدخول لصفحات معينة
function requireAuth() {
  if (!isLoggedIn()) {
    alert("يجب تسجيل الدخول أولاً");
    window.location.href = "auth.html";
  }
}

// بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateAuthLink();

  // زر تسجيل الدخول (بالبريد/كلمة مرور)
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector("#loginEmail").value;
      const password = loginForm.querySelector("#loginPassword").value;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("فشل تسجيل الدخول: " + error.message);
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "account.html";
      }
    });
  }

  // زر إنشاء حساب
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = signupForm.querySelector("#signupEmail").value;
      const password = signupForm.querySelector("#signupPassword").value;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert("فشل إنشاء الحساب: " + error.message);
      } else {
        alert("تم إرسال رابط التحقق إلى بريدك الإلكتروني");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "account.html";
      }
    });
  }

  // زر تسجيل الخروج
  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => logout());
  }
});

// تسجيل الدخول بجوجل
async function handleGoogleSignIn(response) {
  try {
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    localStorage.setItem("user", JSON.stringify({ email: payload.email }));
    window.location.href = "account.html";
  } catch (err) {
    console.error("Google sign-in failed", err);
  }
}
