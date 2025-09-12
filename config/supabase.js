const SUPABASE_URL = "https://kllrcqcfrydllqxwudad.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbHJjcWNmcnlkbGxxeHd1ZGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDAwMDksImV4cCI6MjA3MzIxNjAwOX0.Jisge_vucs0Xv-p4mVaU9uLWnU4oPpTGM1rU6cquV-E";

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
