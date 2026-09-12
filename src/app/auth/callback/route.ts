import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

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
      const redirectParam = searchParams.get("redirect") || "/dashboard";
      const safeRedirect = redirectParam.startsWith("/") ? redirectParam : "/dashboard";
      return NextResponse.redirect(`${origin}${safeRedirect}`);
    }
  }

  const redirectParam = searchParams.get("redirect");
  const loginUrl = new URL(`${origin}/login`);
  if (redirectParam) loginUrl.searchParams.set("redirect", redirectParam);
  return NextResponse.redirect(loginUrl.toString());
}
