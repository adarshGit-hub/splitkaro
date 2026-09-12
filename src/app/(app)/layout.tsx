import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import BottomNav from "@/components/shared/BottomNav";
import React from "react";

export default async function AppLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-full flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0 w-full max-w-5xl mx-auto p-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
