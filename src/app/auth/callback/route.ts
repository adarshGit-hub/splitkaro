import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  // Dynamically resolve the true origin from forwarded headers (works with custom domains, Vercel, localhost)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const origin = forwardedHost 
    ? `${forwardedProto}://${forwardedHost}` 
    : requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();
        
      if (!profile) {
        // Create profile
        await supabase.from("profiles").insert({
          id: data.user.id,
          name: data.user.user_metadata.full_name || data.user.email?.split("@")[0],
          email: data.user.email,
          avatar_url: data.user.user_metadata.avatar_url,
        });
      }
      const redirectParam = requestUrl.searchParams.get("redirect") || "/dashboard";
      const safeRedirect = redirectParam.startsWith("/") ? redirectParam : "/dashboard";
      return NextResponse.redirect(`${origin}${safeRedirect}`);
    }
  }

  const redirectParam = requestUrl.searchParams.get("redirect");
  const loginUrl = new URL(`${origin}/login`);
  if (redirectParam) loginUrl.searchParams.set("redirect", redirectParam);
  return NextResponse.redirect(loginUrl.toString());
}
