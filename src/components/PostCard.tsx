import React from "react";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { Post, MenuTarget } from "../types";
import { Avatar } from "./Avatar";

interface PostCardProps {
  post: Post;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}

export function PostCard({ post, onLike, onBookmark, onOpen, onMenu, flash }: PostCardProps) {
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    flash("Link copied to clipboard");
  };

  return (
    <article
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button, a")) {
          onOpen(post);
        }
      }}
      className="cursor-pointer border-b border-slate-200/80 bg-white px-4 py-4 transition hover:bg-slate-50/60 sm:px-6"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar text={post.avatar} tone={post.avatarTone} size="md" />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="truncate text-sm font-bold text-slate-900">{post.name}</span>
              <span className="truncate text-xs text-slate-400">{post.handle}</span>
              <span className="text-xs text-slate-300">·</span>
              <span className="shrink-0 text-xs text-slate-400">{post.time}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenu({
                  name: post.name,
                  handle: post.handle,
                  kind: "post",
                  contentId: post.id,
                });
              }}
              className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Post options"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Post Text */}
          <div className="mt-1.5 text-sm leading-relaxed text-slate-800">{post.text}</div>

          {/* Tag Chip */}
          {post.tag && (
            <div className="mt-2">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  flash(`Filtering #${post.tag}`);
                }}
                className="inline-block text-xs font-semibold text-blue-600 hover:underline"
              >
                #{post.tag}
              </span>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="mt-3 flex items-center justify-between text-slate-400 sm:max-w-xs">
            {/* Reply */}
            <button
              onClick={() => onOpen(post)}
              className="flex items-center gap-1.5 text-xs font-medium transition hover:text-blue-600"
              title="Reply"
            >
              <MessageCircle size={16} />
              <span>{post.replies}</span>
            </button>

            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(post.id);
              }}
              className={`flex items-center gap-1.5 text-xs font-medium transition ${
                post.liked ? "text-rose-600 font-bold" : "hover:text-rose-600"
              }`}
              title={post.liked ? "Unlike" : "Like"}
            >
              <Heart size={16} fill={post.liked ? "currentColor" : "none"} />
              <span>{post.likes}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(post.id);
                flash(post.bookmarked ? "Bookmark removed" : "Post saved");
              }}
              className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                post.bookmarked ? "text-blue-600" : "hover:text-blue-600"
              }`}
              title="Bookmark"
            >
              <Bookmark size={16} fill={post.bookmarked ? "currentColor" : "none"} />
            </button>

            {/* Share */}
            <button
              onClick={handleCopyLink}
              className="grid h-7 w-7 place-items-center rounded-lg transition hover:text-slate-700"
              title="Copy link"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
