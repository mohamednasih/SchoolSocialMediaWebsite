import React, { useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { Post, UserProfile } from "../types";
import { PageHeader } from "./PageHeader";
import { PostCard } from "./PostCard";
import { Avatar } from "./Avatar";
import { trends, suggestedUsers } from "../data/initialData";

interface ExplorePageProps {
  posts: Post[];
  onOpen: (post: Post) => void;
  onViewProfile: (profile: UserProfile) => void;
  flash: (message: string) => void;
}

export function ExplorePage({ posts, onOpen, onViewProfile, flash }: ExplorePageProps) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const matchingUsers = suggestedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(normalized) ||
      u.handle.toLowerCase().includes(normalized) ||
      u.bio?.toLowerCase().includes(normalized),
  );

  const matchingPosts = posts.filter(
    (p) =>
      p.text.toLowerCase().includes(normalized) ||
      p.name.toLowerCase().includes(normalized) ||
      p.tag?.toLowerCase().includes(normalized.replace("#", "")),
  );

  return (
    <>
      <PageHeader title="Explore" />

      {/* Search Input */}
      <div className="border-b border-slate-200/80 bg-white p-3.5 sm:px-6">
        <label className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs focus-within:border-slate-400 focus-within:bg-white">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, topics, or people..."
            className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-700">
              <X size={15} />
            </button>
          )}
        </label>
      </div>

      {query ? (
        <div className="divide-y divide-slate-100">
          {matchingUsers.length > 0 && (
            <div className="p-4 sm:px-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                People
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {matchingUsers.map((user) => (
                  <button
                    key={user.handle}
                    onClick={() => onViewProfile(user)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50 transition"
                  >
                    <Avatar text={user.initials} tone={user.tone} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="truncate text-[11px] text-slate-400">{user.handle}</p>
                    </div>
                    <ChevronRight size={15} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingPosts.length > 0 ? (
            <div>
              <div className="px-4 py-2 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider sm:px-6">
                Posts ({matchingPosts.length})
              </div>
              {matchingPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => undefined}
                  onBookmark={() => undefined}
                  onOpen={onOpen}
                  onMenu={() => undefined}
                  flash={flash}
                />
              ))}
            </div>
          ) : (
            matchingUsers.length === 0 && (
              <div className="py-20 text-center text-xs text-slate-400">
                No matching posts or people found for "{query}"
              </div>
            )
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {/* Trending List */}
          <section className="py-2">
            <div className="px-4 py-3 sm:px-6">
              <h2 className="text-sm font-black text-slate-900">Trending Now</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {trends.map((trend, i) => (
                <button
                  key={trend.title}
                  onClick={() => setQuery(trend.title)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50 sm:px-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs font-bold text-slate-400">{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">#{trend.title}</p>
                      <p className="text-[11px] text-slate-400">{trend.posts}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-300" />
                </button>
              ))}
            </div>
          </section>

          {/* Popular Posts */}
          <section className="pt-2">
            <div className="px-4 py-3 sm:px-6">
              <h2 className="text-sm font-black text-slate-900">Popular Today</h2>
            </div>
            {posts.slice(0, 3).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => undefined}
                onBookmark={() => undefined}
                onOpen={onOpen}
                onMenu={() => undefined}
                flash={flash}
              />
            ))}
          </section>
        </div>
      )}
    </>
  );
}
