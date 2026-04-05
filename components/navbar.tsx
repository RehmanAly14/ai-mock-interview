import Link from "next/link";
import UserMenu from "@/components/user-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40  bg-slate-950/80 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          AI Mock Interview
        </Link>
        <nav >
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}