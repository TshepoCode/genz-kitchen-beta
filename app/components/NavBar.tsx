"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/app/context/CartContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NavBarProps {
  onCartClick: () => void;
}

interface Profile {
  full_name: string;
  points: number;
}

export default function NavBar({ onCartClick }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const pathname = usePathname();
  const { cart } = useCart();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, points")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log("Profile error:", error.message);
        setProfile(null);
        return;
      }

      setProfile(data);
    };

    getProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getProfile();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full border-b border-lime-500 bg-white text-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-1 text-black hover:bg-lime-200 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="text-xl font-extrabold tracking-wide md:text-2xl">
            <span className="text-lime-400">GenZ</span> Kitchen <span className="text-blue-500 text-sm">Beta</span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "font-semibold text-lime-600"
                : "hover:text-lime-500"
            }
          >
            Home
          </Link>

          <Link
            href="/menu"
            className={
              pathname === "/menu"
                ? "font-semibold text-lime-600"
                : "hover:text-lime-500"
            }
          >
            Menu
          </Link>

          <Link
            href="/deals"
            className={
              pathname === "/deals"
                ? "font-semibold text-lime-600"
                : "hover:text-lime-500"
            }
          >
            Deals
          </Link>


          <Link
            href="/blog"
            className={
              pathname === "/deals"
                ? "font-semibold text-lime-600"
                : "hover:text-lime-500"
            }
          >
            News
          </Link>          
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onCartClick}
            className="relative rounded-md p-1 hover:bg-lime-200"
            aria-label="Cart"
          >
            <ShoppingCart className="h-6 w-6" />

            {cart.length > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-lime-400 px-1.5 py-0.5 text-xs font-bold text-black">
                {cart.length}
              </span>
            )}
          </button>

          {profile ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[90px] truncate text-sm font-semibold text-black sm:block">
                {profile.full_name}
              </span>

              <span className="rounded-full bg-red-400 px-2 py-1 text-xs font-bold text-black md:px-3 md:py-2">
                {profile.points}
              </span>

              <button
                onClick={handleLogout}
                className="hidden rounded-full bg-black px-3 py-2 text-xs font-bold text-white hover:opacity-90 sm:block"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md p-1 hover:bg-lime-200"
              aria-label="Login"
            >
              <User className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-zinc-200 bg-white text-black md:hidden">
          <div className="flex flex-col gap-5 px-6 py-5">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={
                pathname === "/"
                  ? "font-semibold text-lime-400"
                  : "hover:text-lime-400"
              }
            >
              Home
            </Link>

            <Link
              href="/menu"
              onClick={() => setIsOpen(false)}
              className={
                pathname === "/menu"
                  ? "font-semibold text-lime-400"
                  : "hover:text-lime-400"
              }
            >
              Menu
            </Link>

            <Link
              href="/deals"
              onClick={() => setIsOpen(false)}
              className={
                pathname === "/deals"
                  ? "font-semibold text-lime-400"
                  : "hover:text-lime-400"
              }
            >
              Deals
            </Link>

            {profile && (
              <button
                onClick={handleLogout}
                className="rounded-xl bg-black px-4 py-3 text-sm font-bold text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}