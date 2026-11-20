import React, { useState } from "react";
import { Search, X, ArrowLeft, ChevronRight } from "lucide-react";
import { Post, UserProfile } from "../types";
import { PostCard } from "./PostCard";
import { Avatar } from "./Avatar";
import { suggestedUsers } from "../data/initialData";

interface SearchResultsPageProps {
  posts: Post[];
  onBack: () => void;
  onOpenPost: (post: Post) => void;
  onOpenProfile: (profile: UserProfile) => void;
  flash: (msg: string) => void;
}

export function SearchResultsPage({
  posts,
  onBack,
  onOpenPost,
  onOpenProfile,
  flash,
}: SearchResultsPageProps) {
  const [query, setQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"All" | "Posts" | "People">("All");

  const normalized = query.trim().toLowerCase();

  const matchingPosts = posts.filter(
    (p) =>
      p.text.toLowerCase().includes(normalized) ||
      p.name.toLowerCase().includes(normalized) ||
      p.tag?.toLowerCase().includes(normalized.replace("#", "")),
  );

  const matchingPeople = suggestedUsers.filter(
    (p) =>
      p.name.toLowerCase().includes(normalized) ||
      p.handle.toLowerCase().includes(normalized) ||
      p.bio?.toLowerCase().includes(normalized),
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
        <button
          onClick={onBack}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs focus-within:bg-white focus-within:border-slate-400">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Connect..."
            className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </label>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-200/80 bg-white">
        {(["All", "Posts", "People"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSearchTab(tab)}
            className={`relative py-3 text-xs font-bold transition sm:text-sm ${
              searchTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {tab}
            {searchTab === tab && (
              <span className="absolute bottom-0 left-1/2 h-[2.5px] w-10 -translate-x-1/2 rounded-full bg-slate-900" />
            )}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="divide-y divide-slate-100">
        {!normalized ? (
          <div className="py-20 text-center px-4">
            <Search size={28} className="mx-auto text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-700">Type to search</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Find design discussions, people, and topics.
            </p>
          </div>
        ) : (
          <>
            {(searchTab === "All" || searchTab === "People") && matchingPeople.length > 0 && (
              <div className="p-4 sm:px-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  People ({matchingPeople.length})
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {matchingPeople.map((person) => (
                    <button
                      key={person.handle}
                      onClick={() => onOpenProfile(person)}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-left transition hover:bg-slate-50"
                    >
                      <Avatar text={person.initials} tone={person.tone} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900">{person.name}</p>
                        <p className="text-[11px] text-slate-400">{person.handle}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(searchTab === "All" || searchTab === "Posts") && matchingPosts.length > 0 && (
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
                    onOpen={onOpenPost}
                    onMenu={() => undefined}
                    flash={flash}
                  />
                ))}
              </div>
            )}

            {matchingPeople.length === 0 && matchingPosts.length === 0 && (
              <div className="py-20 text-center text-xs text-slate-400">
                No results found for "{query}"
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
