"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-800" />
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white transition hover:bg-slate-800"
        aria-label="Open user menu"
      >
        <User size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          {session ? (
            <div className="p-2">
              <div className="border-b border-slate-800 px-3 py-3">
                <p className="text-sm font-medium text-white">
                  {session.user?.name || "User"}
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {session.user?.email}
                </p>
              </div>

              <div className="mt-2 flex flex-col">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Dashboard
                </Link>

                <Link
                  href="/interview/start"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Start Interview
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="mt-1 rounded-xl px-3 py-2 text-left text-sm text-red-400 transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex flex-col">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}