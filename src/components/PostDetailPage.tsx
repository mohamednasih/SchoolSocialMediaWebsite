import React, { useState } from "react";
import { ArrowLeft, Heart, MoreHorizontal, Send } from "lucide-react";
import { Post, Comment, MenuTarget } from "../types";
import { PostCard } from "./PostCard";
import { Avatar } from "./Avatar";

interface PostDetailPageProps {
  post: Post;
  onBack: () => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}

export function PostDetailPage({
  post,
  onBack,
  onLike,
  onBookmark,
  onMenu,
  flash,
}: PostDetailPageProps) {
  const [reply, setReply] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Maya Chen",
      handle: "@mayac",
      time: "18m ago",
      initials: "MC",
      tone: "bg-emerald-600 text-white",
      text: "Completely agree with this. Reducing visual clutter makes the core product value stand out immediately.",
      likes: 6,
    },
    {
      id: 2,
      name: "Liam Vance",
      handle: "@liamv",
      time: "12m ago",
      initials: "LV",
      tone: "bg-blue-600 text-white",
      text: "The subtle border-slate-200 styling also feels much softer on eyes than stark black borders.",
      likes: 3,
    },
  ]);
  const [likedComments, setLikedComments] = useState<number[]>([]);

  const handleAddComment = () => {
    if (!reply.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      name: "Alex Morgan",
      handle: "@alexm",
      time: "Just now",
      initials: "AM",
      tone: "bg-slate-900 text-white",
      text: reply.trim(),
      likes: 0,
    };

    setComments((prev) => [...prev, newComment]);
    setReply("");
    flash("Reply sent");
  };

  const toggleCommentLike = (id: number) => {
    setLikedComments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
        <button
          onClick={onBack}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-base font-black text-slate-900">Post</h1>
      </header>

      {/* Main Post */}
      <PostCard
        post={post}
        onLike={onLike}
        onBookmark={onBookmark}
        onOpen={() => undefined}
        onMenu={onMenu}
        flash={flash}
      />

      {/* Reply Input */}
      <section className="border-b border-slate-200/80 bg-white px-4 py-3.5 sm:px-6">
        <div className="flex gap-3">
          <Avatar text="AM" tone="bg-slate-900 text-white" size="sm" />
          <div className="min-w-0 flex-1">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value.slice(0, 280))}
              rows={2}
              placeholder="Post your reply"
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
              <span className="text-xs text-slate-400">{280 - reply.length} left</span>
              <button
                onClick={handleAddComment}
                disabled={!reply.trim()}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comment Thread */}
      <div className="divide-y divide-slate-100">
        {comments.map((comment) => {
          const liked = likedComments.includes(comment.id);
          return (
            <article key={comment.id} className="px-4 py-3.5 sm:px-6 hover:bg-slate-50/50">
              <div className="flex gap-3">
                <Avatar text={comment.initials} tone={comment.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{comment.name}</span>
                      <span className="text-xs text-slate-400">{comment.handle}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{comment.time}</span>
                    </div>

                    <button
                      onClick={() =>
                        onMenu({
                          name: comment.name,
                          handle: comment.handle,
                          kind: "comment",
                        })
                      }
                      className="grid h-6 w-6 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-slate-800 leading-relaxed">{comment.text}</p>

                  <div className="mt-2 flex items-center gap-4 text-xs font-medium text-slate-400">
                    <button
                      onClick={() => toggleCommentLike(comment.id)}
                      className={`flex items-center gap-1 ${
                        liked ? "text-rose-600 font-bold" : "hover:text-rose-600"
                      }`}
                    >
                      <Heart size={14} fill={liked ? "currentColor" : "none"} />
                      <span>{comment.likes + (liked ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
