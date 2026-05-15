"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { logoutAction } from "@/actions/auth";

interface NavBarProps {
  loggedIn?: boolean;
}

export default function Navbar({ loggedIn = false }: NavBarProps) {
  const logout = useAuthStore((s) => s.logout);
  const handleLogout = async () => {
    logout();
    await logoutAction();
  };

  const path = usePathname();
  const disabled = path === "/login" || path === "/join";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
        {/* Brand Name */}
        <Link
          href={"/"}
          className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
        >
          chirp
        </Link>
        {!disabled && (
          <Link
            href={"/board"}
            className="text-base ml-auto mr-8 hover:opacity-80 transition-opacity"
          >
            Dashboard
          </Link>
        )}

        {!disabled &&
          (loggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all px-3 h-9"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all px-3 h-9"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          ))}
      </div>
    </nav>
  );
}
