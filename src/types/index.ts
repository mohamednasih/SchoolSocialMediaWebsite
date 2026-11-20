export type Page =
  | "Home"
  | "Explore"
  | "Notifications"
  | "Messages"
  | "Bookmarks"
  | "Profile"
  | "Settings"
  | "Search";

export type Post = {
  id: number;
  name: string;
  handle: string;
  time: string;
  avatar: string;
  avatarTone: string;
  text: string;
  tag?: string;
  replies: number;
  likes: number;
  liked?: boolean;
  bookmarked?: boolean;
};

export type MenuTarget = {
  name: string;
  handle: string;
  kind: "post" | "comment";
  contentId?: number;
};

export type UserProfile = {
  name: string;
  handle: string;
  initials: string;
  tone: string;
  online: boolean;
  bio?: string;
  location?: string;
  website?: string;
  following?: boolean;
  followersCount?: number;
  followingCount?: number;
};

export type Comment = {
  id: number;
  name: string;
  handle: string;
  time: string;
  initials: string;
  tone: string;
  text: string;
  likes: number;
  liked?: boolean;
};

export type ChatMessage = {
  id: number;
  sender: "them" | "me";
  text: string;
  time: string;
};

export type Conversation = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  tone: string;
  preview: string;
  time: string;
  unread: boolean;
  online: boolean;
  messages: ChatMessage[];
};

export type Trend = {
  title: string;
  posts: string;
  category?: string;
};
