// src/components/navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function NavLink({
  href,
  children,
  pathname,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
  onNavigate: () => void;
}) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-cyan-400",
        isActive ? "text-cyan-400" : "text-muted-foreground"
      )}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-90 transition-opacity">
          <span className="text-gradient">DIGITAL HEROES</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/charities" pathname={pathname} onNavigate={() => setIsOpen(false)}>Charities</NavLink>
          <NavLink href="/draws" pathname={pathname} onNavigate={() => setIsOpen(false)}>Draws</NavLink>
          <NavLink href="/pricing" pathname={pathname} onNavigate={() => setIsOpen(false)}>Pricing</NavLink>
          
          <div className="flex items-center gap-4 ml-4">
            {session ? (
              <>
                 <Link href="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                 </Link>
                 <Button 
                    variant="outline" 
                    size="sm"
                    className="border-red-900/50 hover:bg-red-950/30 text-red-400" 
                    onClick={() => signOut({ callbackUrl: '/' })}
                 >
                    Log out
                 </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="premium" size="sm" className="shadow-none">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-white/5 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-4 animate-accordion-down">
          <div className="flex flex-col gap-4">
            <NavLink href="/charities" pathname={pathname} onNavigate={() => setIsOpen(false)}>Charities</NavLink>
            <NavLink href="/draws" pathname={pathname} onNavigate={() => setIsOpen(false)}>Draws</NavLink>
            <NavLink href="/pricing" pathname={pathname} onNavigate={() => setIsOpen(false)}>Pricing</NavLink>
            <hr className="border-white/5" />
             {session ? (
              <>
                 <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                 </Link>
                 <Button 
                    variant="outline" 
                    className="w-full justify-start border-red-900/50 text-red-400" 
                    onClick={() => signOut({ callbackUrl: '/' })}
                 >
                    Log out
                 </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button variant="premium" className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
