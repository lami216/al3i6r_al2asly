// config/supabase.js

// ضع بيانات الربط هنا بعد إنشاء حساب في Supabase
const SUPABASE_URL = "";        // مثال: "https://xxxxx.supabase.co"
const SUPABASE_ANON_KEY = "";   // مثال: "eyJhbGciOiJIUzI1NiIsInR5cCI6..."

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة اختبار (اختيارية) عشان تتأكد أن الاتصال شغال
async function testConnection() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️ لم يتم إعداد Supabase بعد. أضف القيم في config/supabase.js");
    return;
  }
  let { data, error } = await supabase.from("products").select("*").limit(1);
  if (error) {
    console.error("خطأ في الاتصال بـSupabase:", error.message);
  } else {
    console.log("✅ الاتصال ناجح. بيانات:", data);
  }
}
