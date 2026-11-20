import React, { useState } from "react";
import { ArrowLeft, MessageCircle, MapPin, Link as LinkIcon, Share2 } from "lucide-react";
import { UserProfile, Post, Page, MenuTarget } from "../types";
import { PostCard } from "./PostCard";
import { Avatar } from "./Avatar";

interface OtherProfilePageProps {
  profile: UserProfile;
  posts: Post[];
  onBack: () => void;
  navigate: (page: Page) => void;
  onOpenChatWith: (profile: UserProfile) => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}

export function OtherProfilePage({
  profile,
  posts,
  onBack,
  navigate,
  onOpenChatWith,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: OtherProfilePageProps) {
  const [isFollowing, setIsFollowing] = useState(profile.following ?? true);

  const userPosts = posts.filter((p) => p.handle === profile.handle);

  const toggleFollow = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    flash(next ? `Following ${profile.name}` : `Unfollowed ${profile.name}`);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-black text-slate-900">{profile.name}</h1>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            flash("Profile link copied");
          }}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <Share2 size={16} />
        </button>
      </header>

      {/* Cover Banner */}
      <div className="h-28 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 sm:h-36" />

      {/* Profile Overview */}
      <div className="border-b border-slate-200/80 bg-white px-4 pb-4 sm:px-6">
        <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3">
          <Avatar
            text={profile.initials}
            tone={`${profile.tone} border-4 border-white shadow-sm`}
            size="xl"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChatWith(profile)}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <MessageCircle size={14} />
              <span>Message</span>
            </button>

            <button
              onClick={toggleFollow}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                isFollowing
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-lg font-black text-slate-900">{profile.name}</h1>
          <p className="text-xs text-slate-400">{profile.handle}</p>
        </div>

        {profile.bio && (
          <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
        )}

        {/* Location & Web */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin size={13} />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1 text-blue-600 hover:underline">
              <LinkIcon size={13} />
              <a href={`https://${profile.website}`} target="_blank" rel="noreferrer">
                {profile.website}
              </a>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span>
            <strong className="text-slate-900 font-bold">{profile.followingCount || 240}</strong>{" "}
            Following
          </span>
          <span>
            <strong className="text-slate-900 font-bold">{profile.followersCount || 890}</strong>{" "}
            Followers
          </span>
        </div>
      </div>

      {/* User Posts */}
      <div className="divide-y divide-slate-100">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
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
          <div className="py-16 text-center text-xs text-slate-400">
            No posts from {profile.name} yet.
          </div>
        )}
      </div>
    </>
  );
}
