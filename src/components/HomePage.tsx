import React, { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Post, MenuTarget } from "../types";
import { PageHeader } from "./PageHeader";
import { PostCard } from "./PostCard";
import { Avatar } from "./Avatar";

interface HomePageProps {
  posts: Post[];
  draft: string;
  setDraft: (val: string) => void;
  publish: (tag?: string) => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}

export function HomePage({
  posts,
  draft,
  setDraft,
  publish,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: HomePageProps) {
  const [tab, setTab] = useState<"For you" | "Following">("For you");
  const [selectedTag, setSelectedTag] = useState("");

  const characterLimit = 280;
  const remaining = characterLimit - draft.length;

  const handlePublish = () => {
    if (!draft.trim()) return;
    publish(selectedTag || undefined);
    setSelectedTag("");
  };

  const filteredPosts = posts.filter((post) => {
    if (tab === "Following") {
      return ["@mayac", "@sarahj", "@alexm"].includes(post.handle);
    }
    return true;
  });

  return (
    <>
      <PageHeader
        title="Home"
        action={
          <button
            onClick={() => flash("Sorted by latest posts")}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Sort preferences"
          >
            <Sparkles size={17} />
          </button>
        }
      />

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-200/80 bg-white">
        {(["For you", "Following"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`relative py-3.5 text-sm font-bold transition ${
              tab === item ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {item}
            {tab === item && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-slate-900" />
            )}
          </button>
        ))}
      </div>

      {/* Post Composer */}
      <section className="border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6">
        <div className="flex gap-3">
          <Avatar text="AM" tone="bg-slate-900 text-white" size="md" />
          <div className="min-w-0 flex-1">
            <textarea
              id="composer"
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, characterLimit))}
              rows={2}
              placeholder="What's happening?"
              className="w-full resize-none bg-transparent pt-1 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            {/* Quick tag selector */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 pb-1">
              {["DesignSystems", "UIUX", "MinimalUI", "WebDesign", "Ideas"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                    selectedTag === tag
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Composer Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
              <span className="text-xs text-slate-400 font-medium">
                {remaining} characters left
              </span>

              <button
                onClick={handlePublish}
                disabled={!draft.trim()}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Posts */}
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onBookmark={onBookmark}
          onOpen={onOpen}
          onMenu={onMenu}
          flash={flash}
        />
      ))}
    </>
  );
}
