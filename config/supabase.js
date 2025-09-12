// config/supabase.js

// بيانات الاتصال الخاصة بمشروعك في Supabase
const SUPABASE_URL = "https://kllrcqcfrydllqxwudad.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbHJjcWNmcnlkbGxxeHd1ZGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDAwMDksImV4cCI6MjA3MzIxNjAwOX0.Jisge_vucs0Xv-p4mVaU9uLWnU4oPpTGM1rU6cquV-E";

// إنشاء عميل Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة اختبار للتأكد أن الاتصال شغال
async function testConnection() {
  try {
    let { data, error } = await supabase.from("products").select("*").limit(1);
    if (error) {
      console.error("❌ خطأ في الاتصال بـ Supabase:", error.message);
    } else {
      console.log("✅ الاتصال ناجح. أول منتج:", data);
    }
  } catch (err) {
    console.error("⚠️ فشل الاتصال:", err.message);
  }
}
