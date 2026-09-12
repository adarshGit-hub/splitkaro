"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push("/login");
    router.refresh();
  };

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dropdownOpen]);

  return (
    <nav className="w-full bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl text-primary font-sans hover:opacity-90 transition-opacity">
          SplitKaro
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-muted p-2 rounded-lg transition-colors"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                <User className="w-5 h-5" />
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium">
              {profile?.name || "User"}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1">
              <Link 
                href="/dashboard" 
                onClick={() => setDropdownOpen(false)}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-muted text-foreground"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-muted text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
