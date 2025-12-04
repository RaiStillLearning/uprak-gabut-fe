"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

// ✅ Pakai ID, bukan href
const navItems = [
  { name: "Employee Data", id: "employeedata" },
  { name: "Employee Form", id: "employeeform" },

];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("home");

  // ✅ Smooth scroll dengan offset navbar
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const navbarHeight = 64; // h-16 = 64px
    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - navbarHeight,
      behavior: "smooth",
    });

    setActive(id);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ✅ LOGO */}
        <button
          onClick={() => handleScroll("home")}
          className="text-lg font-bold tracking-tight transition-colors hover:text-primary"
        >
          Rakha Arkana
        </button>

        {/* ✅ DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = active === item.id;

            return (
              <button
                key={item.name}
                onClick={() => handleScroll(item.id)}
                className={`relative text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            );
          })}

          <AnimatedThemeToggler />

        </div>

        {/* ✅ MOBILE MENU */}
        <div className="flex md:hidden items-center gap-2">
          <AnimatedThemeToggler />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:w-[380px] px-0">
              <div className="flex items-center justify-between px-6 pb-6 border-b">
                <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
              </div>

              <div className="flex flex-col px-6 py-6">
                <div className="flex flex-col   gap-1">
                  {navItems.map((item) => {
                    const isActive = active === item.id;

                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          handleScroll(item.id);
                          setIsOpen(false);
                        }}
                        className={`group relative rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 text-left ${
                          isActive
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`}
                      >
                        <span className="relative z-10">{item.name}</span>

                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-3">
                  <Button
                    className="w-full h-12 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Hire Me
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    © 2025 Rakha Arkana
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}