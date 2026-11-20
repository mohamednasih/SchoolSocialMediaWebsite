import React from "react";
import {
  Home,
  Compass,
  Bell,
  Mail,
  Bookmark,
  CircleUserRound,
  Settings,
  PenLine,
} from "lucide-react";
import { Page } from "../types";
import { Avatar } from "./Avatar";

interface SidebarProps {
  activePage: Page;
  navigate: (page: Page) => void;
  onOpenComposer: () => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
}

export function Sidebar({
  activePage,
  navigate,
  onOpenComposer,
  unreadNotificationsCount = 2,
  unreadMessagesCount = 1,
}: SidebarProps) {
  const navItems: {
    label: Page;
    icon: React.ComponentType<{ size: number; strokeWidth?: number; className?: string }>;
    badge?: number;
  }[] = [
    { label: "Home", icon: Home },
    { label: "Explore", icon: Compass },
    {
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    {
      label: "Messages",
      icon: Mail,
      badge: unreadMessagesCount,
    },
    { label: "Bookmarks", icon: Bookmark },
    { label: "Profile", icon: CircleUserRound },
    { label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-[76px] md:flex-col md:border-r md:border-slate-200/80 md:bg-white md:px-2 xl:w-[240px] xl:px-4">
        {/* Brand Monogram */}
        <div className="flex h-16 items-center justify-center xl:justify-start xl:px-2">
          <button
            onClick={() => navigate("Home")}
            className="group flex items-center gap-3 text-left transition"
            aria-label="Connect home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-lg shadow-sm transition group-hover:bg-slate-800">
              C
            </div>
            <span className="hidden text-lg font-black tracking-tight text-slate-900 xl:inline">
              Connect
            </span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.label;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className={`group relative flex w-full items-center justify-center gap-3.5 rounded-xl px-3 py-3 text-left transition xl:justify-start ${
                  active
                    ? "bg-slate-100 font-bold text-slate-900"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={`transition-colors ${
                      active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white xl:hidden">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                <span className="hidden text-sm xl:inline">{item.label}</span>

                {item.badge && item.badge > 0 ? (
                  <span className="ml-auto hidden h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white xl:flex">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Primary Action Button */}
        <div className="py-2">
          <button
            onClick={onOpenComposer}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white text-sm shadow-xs transition hover:bg-slate-800 active:scale-[0.98]"
            title="Create Post"
          >
            <PenLine size={17} />
            <span className="hidden xl:inline">Post</span>
          </button>
        </div>

        {/* User Card */}
        <div className="pb-4 pt-2">
          <button
            onClick={() => navigate("Profile")}
            className="group flex w-full items-center justify-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-100 xl:justify-start"
          >
            <Avatar text="AM" tone="bg-slate-900 text-white" size="sm" />
            <div className="hidden min-w-0 flex-1 xl:block">
              <p className="truncate text-xs font-bold text-slate-900">Alex Morgan</p>
              <p className="truncate text-[11px] text-slate-400">@alexm</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md md:hidden">
        {navItems
          .filter((item) =>
            ["Home", "Explore", "Notifications", "Messages", "Profile"].includes(item.label),
          )
          .map((item) => {
            const Icon = item.icon;
            const active = activePage === item.label;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className={`relative flex flex-col items-center justify-center py-1 px-3 transition ${
                  active ? "text-slate-900 font-bold" : "text-slate-400 hover:text-slate-700"
                }`}
                aria-label={item.label}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute top-1 right-2.5 h-2 w-2 rounded-full bg-blue-600" />
                ) : null}
              </button>
            );
          })}
      </aside>
    </>
  );
}
