"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-xl border border-slate-700 px-4 py-3 font-medium text-white transition hover:bg-slate-900"
    >
      Logout
    </button>
  );
}