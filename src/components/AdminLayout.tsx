import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/posts", label: "Blog Posts" },
  { to: "/projects", label: "Projects" },
  { to: "/downloads", label: "Downloads" },
  { to: "/categories", label: "Categories" },
  { to: "/media", label: "Media Library" },
  { to: "/videos", label: "Featured Videos" },
  { to: "/subscribers", label: "Subscribers" },
  { to: "/settings", label: "Settings" },
  { to: "/backup", label: "Backup / Export" },
  { to: "/profile", label: "Profile" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 shrink-0 border-r border-cyan-400/10 bg-navy-soft/40 flex flex-col">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-cyan-400/10">
          <img src="/assets/logo.png" alt="" className="w-7 h-7 rounded-md" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />
          <span className="font-mono text-sm font-semibold text-ink">Johnres Admin</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "text-cyan-bright bg-cyan-400/10" : "text-ink-muted hover:text-ink hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-cyan-400/10">
          <p className="text-xs text-ink-dim truncate mb-2">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 rounded-md text-xs font-mono border border-cyan-400/20 text-ink-muted hover:text-ink hover:border-cyan-400/50 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
