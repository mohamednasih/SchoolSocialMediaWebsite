import React, { useState } from "react";
import { Edit3, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Post, MenuTarget, Page } from "../types";
import { PageHeader } from "./PageHeader";
import { PostCard } from "./PostCard";
import { Avatar } from "./Avatar";
import { EditProfileModal } from "./Modals";

interface ProfilePageProps {
  posts: Post[];
  navigate: (page: Page) => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}

export function ProfilePage({
  posts,
  navigate,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: ProfilePageProps) {
  const [tab, setTab] = useState<"Posts" | "Saved">("Posts");
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Alex Morgan",
    bio: "Product designer & interface builder. Interested in minimal design, design systems, and web performance.",
    location: "San Francisco, CA",
    website: "alexmorgan.design",
  });

  const ownPosts = posts.filter((p) => p.handle === "@alexm");
  const savedPosts = posts.filter((p) => p.bookmarked);

  return (
    <>
      <PageHeader title={profileData.name} subtitle={`${ownPosts.length} posts`} />

      {/* Clean Cover Banner */}
      <div className="h-28 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 sm:h-36" />

      {/* Profile Info */}
      <div className="border-b border-slate-200/80 bg-white px-4 pb-4 sm:px-6">
        <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3">
          <Avatar
            text="AM"
            tone="bg-slate-900 text-white border-4 border-white shadow-sm"
            size="xl"
          />

          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Edit3 size={13} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div>
          <h1 className="text-lg font-black text-slate-900">{profileData.name}</h1>
          <p className="text-xs text-slate-400">@alexm</p>
        </div>

        <p className="mt-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {profileData.bio}
        </p>

        {/* Location & Links */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          {profileData.location && (
            <div className="flex items-center gap-1">
              <MapPin size={13} />
              <span>{profileData.location}</span>
            </div>
          )}
          {profileData.website && (
            <div className="flex items-center gap-1 text-blue-600 hover:underline">
              <LinkIcon size={13} />
              <a href={`https://${profileData.website}`} target="_blank" rel="noreferrer">
                {profileData.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={13} />
            <span>Joined March 2024</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3.5 flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span>
            <strong className="text-slate-900 font-bold">380</strong> Following
          </span>
          <span>
            <strong className="text-slate-900 font-bold">1,420</strong> Followers
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-200/80 bg-white">
        {(["Posts", "Saved"] as const).map((item) => (
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

      {/* Posts */}
      {(tab === "Posts" ? ownPosts : savedPosts).map((post) => (
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={profileData}
        onSave={(data) => setProfileData(data)}
        flash={flash}
      />
    </>
  );
}
