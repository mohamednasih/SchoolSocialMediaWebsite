import React, { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Page, UserProfile } from "../types";
import { trends, suggestedUsers } from "../data/initialData";
import { Avatar } from "./Avatar";

interface RightRailProps {
  navigate: (page: Page) => void;
  onSearch: () => void;
  onViewProfile: (profile: UserProfile) => void;
  flash: (msg: string) => void;
}

export function RightRail({ navigate, onSearch, onViewProfile, flash }: RightRailProps) {
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    "@mayac": true,
    "@sarahj": true,
  });

  const toggleFollow = (handle: string, name: string) => {
    const isNow = !followingMap[handle];
    setFollowingMap((prev) => ({ ...prev, [handle]: isNow }));
    flash(isNow ? `Following ${name}` : `Unfollowed ${name}`);
  };

  return (
    <aside className="hidden xl:block xl:w-[320px] xl:px-4 xl:py-4">
      <div className="sticky top-4 space-y-4">
        {/* Search Bar */}
        <button
          onClick={onSearch}
          className="group flex w-full items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-xs text-slate-400 transition hover:border-slate-300 hover:bg-white"
        >
          <Search size={16} className="text-slate-400 group-hover:text-slate-700" />
          <span>Search posts, tags, people...</span>
        </button>

        {/* Trending Topics */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4">
          <h2 className="text-sm font-black text-slate-900 pb-2">Trending</h2>
          <div className="divide-y divide-slate-100">
            {trends.map((trend) => (
              <button
                key={trend.title}
                onClick={() => navigate("Explore")}
                className="flex w-full items-center justify-between py-2.5 text-left transition hover:bg-slate-50 -mx-1 px-1 rounded-lg"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">#{trend.title}</p>
                  <p className="text-[11px] text-slate-400">{trend.posts}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </button>
            ))}
          </div>
        </section>

        {/* Who to follow */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4">
          <h2 className="text-sm font-black text-slate-900 pb-3">Who to follow</h2>
          <div className="space-y-3">
            {suggestedUsers.slice(0, 3).map((user) => {
              const isFollowing = followingMap[user.handle];
              return (
                <div key={user.handle} className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewProfile(user)}
                    className="flex min-w-0 items-center gap-2.5 text-left"
                  >
                    <Avatar text={user.initials} tone={user.tone} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900 hover:underline">
                        {user.name}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">{user.handle}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleFollow(user.handle, user.name)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                      isFollowing
                        ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Minimal Footer */}
        <div className="px-2 text-[11px] text-slate-400 space-y-1">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                navigate("Settings");
              }}
              className="hover:underline"
            >
              About
            </a>
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                navigate("Settings");
              }}
              className="hover:underline"
            >
              Privacy
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                navigate("Settings");
              }}
              className="hover:underline"
            >
              Terms
            </a>
          </div>
          <p>© 2026 Connect</p>
        </div>
      </div>
    </aside>
  );
}
