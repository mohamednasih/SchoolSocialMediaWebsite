import React, { useState } from "react";
import { Bookmark, Search } from "lucide-react";
import { Post, MenuTarget } from "../types";
import { PageHeader } from "./PageHeader";
import { PostCard } from "./PostCard";

interface BookmarksPageProps {
  posts: Post[];
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}

export function BookmarksPage({
  posts,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: BookmarksPageProps) {
  const [query, setQuery] = useState("");
  const bookmarkedPosts = posts.filter((p) => p.bookmarked);

  const filtered = bookmarkedPosts.filter(
    (p) =>
      p.text.toLowerCase().includes(query.toLowerCase()) ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tag?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader title="Bookmarks" subtitle={`${bookmarkedPosts.length} saved posts`} />

      {bookmarkedPosts.length > 0 && (
        <div className="border-b border-slate-200/80 bg-white p-3 sm:px-6">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full bg-transparent text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      )}

      {filtered.length > 0 ? (
        filtered.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={onLike}
            onBookmark={onBookmark}
            onOpen={onOpen}
            onMenu={onMenu}
            flash={flash}
          />
        ))
      ) : (
        <div className="py-20 text-center px-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <Bookmark size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {bookmarkedPosts.length === 0 ? "No saved bookmarks yet" : "No matching bookmarks"}
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
            Save posts by clicking the bookmark icon to revisit them later.
          </p>
        </div>
      )}
    </>
  );
}
