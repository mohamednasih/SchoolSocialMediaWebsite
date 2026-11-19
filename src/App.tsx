import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Megaphone,
  Bell,
  BellOff,
  Bookmark,
  ChevronRight,
  CircleUserRound,
  Ellipsis,
  Heart,
  Home,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  PenLine,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react";
import { SessionGate } from "./SessionGate";
import { SchoolBrand } from "./SchoolBrand";
import { SectionTabs } from "./SectionTabs";
import { CreatePost } from "./CreatePost";

type Page =
  | "Home"
  | "Explore"
  | "Friends"
  | "Notifications"
  | "Messages"
  | "Bookmarks"
  | "Profile"
  | "Settings"
  | "Account"
  | "Search";

type Post = {
  id: number;
  name: string;
  handle: string;
  time: string;
  avatar: string;
  avatarTone: string;
  audience?: string;
  text: string;
  tag?: string;
  replies: number;
  likes: number;
  liked?: boolean;
  bookmarked?: boolean;
};

type MenuTarget = {
  name: string;
  handle: string;
  kind: "post" | "comment";
  contentId?: number;
};

type UserProfile = {
  name: string;
  handle: string;
  initials: string;
  tone: string;
  online: boolean;
  status?: string;
};

const initialPosts: Post[] = [
  {
    id: 1,
    name: "Westbridge School",
    handle: "@westbridge",
    time: "24m",
    avatar: "W",
    avatarTone: "bg-navy text-white",
    audience: "School announcement",
    text: "We’ve published a new guide to respectful conversations online. Please take a moment to read it and help keep Westbridge Connect welcoming for everyone.",
    tag: "CommunityGuidelines",
    replies: 12,
    likes: 86,
    bookmarked: true,
  },
  {
    id: 2,
    name: "Maya Chen",
    handle: "@mayac",
    time: "48m",
    avatar: "MC",
    avatarTone: "bg-[#E9A27B] text-[#4C271D]",
    text: "Does anyone have a good way to remember the stages of cell division? I’m making revision notes and would love to compare ideas.",
    replies: 4,
    likes: 38,
    liked: true,
  },
  {
    id: 5,
    name: "Alex Morgan",
    handle: "@alexm",
    time: "52m",
    avatar: "AM",
    avatarTone: "bg-[#F0C966] text-[#493407]",
    text: "I tried making a one-page summary after each lesson today. It made the key ideas much easier to remember.",
    tag: "StudyTips",
    replies: 6,
    likes: 29,
  },
  {
    id: 3,
    name: "Mr. Adeyemi",
    handle: "@adeyemi_science",
    time: "1h",
    avatar: "OA",
    avatarTone: "bg-[#BDD8CC] text-[#153D33]",
    text: "Year 9 scientists: remember that your ecology field notes are due Friday. I’ve added an example layout to the class resources folder.",
    tag: "Science",
    replies: 7,
    likes: 24,
    bookmarked: true,
  },
  {
    id: 4,
    name: "Leo Martins",
    handle: "@leom",
    time: "2h",
    avatar: "LM",
    avatarTone: "bg-[#DCE7F5] text-[#173D76]",
    text: "What book has everyone enjoyed most this term? I need a recommendation for my next library pick.",
    tag: "BookTalk",
    replies: 9,
    likes: 64,
  },
];

const navItems: { label: Page; icon: typeof Home; badge?: number; inProfileMenu?: boolean }[] = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Search },
  { label: "Friends", icon: Users, badge: 2 },
  { label: "Notifications", icon: Bell, badge: 3, inProfileMenu: true },
  { label: "Messages", icon: Mail, badge: 2 },
  { label: "Bookmarks", icon: Bookmark, inProfileMenu: true },
  { label: "Profile", icon: CircleUserRound, inProfileMenu: true },
  { label: "Settings", icon: Settings, inProfileMenu: true },
];

const trends = [
  { title: "ExamTips", posts: "126 posts" },
  { title: "StudyResources", posts: "83 posts" },
  { title: "SchoolIdeas", posts: "47 posts" },
  { title: "BookTalk", posts: "31 posts" },
];

const people = [
  {
    name: "Ms. Brooks",
    handle: "@brooks_music",
    initials: "SB",
    tone: "bg-[#DCC8ED] text-[#432D58]",
  },
  { name: "Leo Martins", handle: "@leom", initials: "LM", tone: "bg-[#BFDCE8] text-[#183E4B]" },
  {
    name: "Library",
    handle: "@westbridge_library",
    initials: "L",
    tone: "bg-[#F1D8B6] text-[#543A18]",
  },
];

const onlineFriends = [
  {
    name: "Maya Chen",
    handle: "@mayac",
    initials: "MC",
    tone: "bg-[#E9A27B] text-[#4C271D]",
    status: "In the music room",
  },
  {
    name: "Leo Martins",
    handle: "@leom",
    initials: "LM",
    tone: "bg-[#BFDCE8] text-[#183E4B]",
    status: "Active now",
  },
  {
    name: "Sofia Patel",
    handle: "@sofiap",
    initials: "SP",
    tone: "bg-[#F1D8B6] text-[#543A18]",
    status: "Active 3m ago",
  },
  {
    name: "Noah Williams",
    handle: "@noahw",
    initials: "NW",
    tone: "bg-[#DCC8ED] text-[#432D58]",
    status: "Active 8m ago",
  },
];

const conversations = [
  {
    name: "Maya Chen",
    initials: "MC",
    tone: "bg-[#E9A27B] text-[#4C271D]",
    preview: "That makes sense now, thank you!",
    time: "10:42",
    unread: true,
    online: true,
  },
  {
    name: "Mr. Adeyemi",
    initials: "OA",
    tone: "bg-[#BDD8CC] text-[#153D33]",
    preview: "The field trip form is in Resources.",
    time: "Mon",
    unread: true,
    online: false,
  },
  {
    name: "Year 10 House Team",
    initials: "10",
    tone: "bg-[#DCE7F5] text-[#173D76]",
    preview: "Leo: Great work today, everyone!",
    time: "Sun",
    unread: false,
    online: true,
  },
  {
    name: "Ms. Brooks",
    initials: "SB",
    tone: "bg-[#DCC8ED] text-[#432D58]",
    preview: "I liked your reading recommendation.",
    time: "Fri",
    unread: false,
    online: true,
  },
];

function focusInlineHeading(heading: HTMLHeadingElement | null) {
  heading?.focus();
}

function Avatar({
  text,
  tone,
  size = "md",
}: {
  text: string;
  tone: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-xs",
    lg: "h-11 w-11 text-sm",
    xl: "h-24 w-24 text-2xl",
  };
  return (
    <div
      className={`${sizes[size]} ${tone} flex shrink-0 items-center justify-center rounded-full font-bold tracking-tight`}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}

function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="page-header justify-between">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

function PostCard({
  post,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: {
  post: Post;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  return (
    <article
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest("button")) onOpen(post);
      }}
      className="post-row"
    >
      <div className="post-avatar">
        <Avatar text={post.avatar} tone={post.avatarTone} size="md" />
      </div>
      <div className="post-byline">
        <div className="min-w-0">
          <p className="break-words text-base font-bold leading-snug">{post.name}</p>
          {post.audience && (
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-accent">
              <Megaphone size={13} aria-hidden="true" />
              {post.audience}
            </p>
          )}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted">
          <span>{post.time}</span>
          {post.handle === "@alexm" && (
            <button
              onClick={() =>
                onMenu({
                  name: post.name,
                  handle: post.handle,
                  kind: "post",
                  contentId: post.id,
                })
              }
              className="-mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-tint hover:text-accent"
              aria-label="More options"
            >
              <Ellipsis size={19} />
            </button>
          )}
        </div>
      </div>
      <button onClick={() => onOpen(post)} className="post-copy">
        {post.text} {post.tag && <span className="font-semibold text-accent">#{post.tag}</span>}
      </button>
      <div className="post-actions">
        <button
          onClick={() => onOpen(post)}
          aria-label={`Open ${post.replies} replies`}
          className="group flex items-center gap-1.5 text-xs font-semibold transition hover:text-accent"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full group-hover:bg-tint">
            <MessageCircle size={18} />
          </span>
          {post.replies}
        </button>
        <button
          aria-label={post.liked ? "Unlike post" : "Like post"}
          aria-pressed={!!post.liked}
          onClick={() => onLike(post.id)}
          className={`group flex items-center gap-1.5 text-xs font-semibold transition ${
            post.liked ? "text-[#D34E6C]" : "hover:text-[#D34E6C]"
          }`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full group-hover:bg-[#FCECF0]">
            <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
          </span>
          {post.likes}
        </button>
        <button
          aria-pressed={!!post.bookmarked}
          onClick={() => onBookmark(post.id)}
          className={`ml-auto grid h-8 w-8 place-items-center rounded-full transition hover:bg-tint hover:text-accent ${
            post.bookmarked ? "text-accent" : ""
          }`}
          aria-label="Bookmark"
        >
          <Bookmark size={18} fill={post.bookmarked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => flash("Share options")}
          className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-tint hover:text-accent"
          aria-label="Share"
        >
          <Send size={17} />
        </button>
      </div>
    </article>
  );
}

function HomePage({
  posts,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: {
  posts: Post[];
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const [tab, setTab] = useState<"For you" | "Friends">("For you");
  return (
    <>
      <header className="feed-heading">
        <div className="min-w-0">
          <h1 className="page-title">Home</h1>
          <p className="mt-0.5 text-sm text-muted">Tuesday, 14 May</p>
        </div>
        <SectionTabs
          label="Home feed"
          items={["For you", "Friends"] as const}
          value={tab}
          onChange={setTab}
        />
        <button
          onClick={() => flash("Feed preferences")}
          className="icon-button"
          aria-label="Feed preferences"
        >
          <Sparkles size={18} />
        </button>
      </header>
      {posts.map((post) => (
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

function PostDetailPage({
  post,
  onBack,
  onLike,
  onBookmark,
  onMenu,
  flash,
}: {
  post: Post;
  onBack: () => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const [reply, setReply] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Maya Chen",
      handle: "@mayac",
      time: "16m",
      initials: "MC",
      tone: "bg-[#E9A27B] text-[#4C271D]",
      text: "Thanks for sharing this. I was wondering about the same thing.",
      likes: 7,
    },
    {
      id: 2,
      name: "Leo Martins",
      handle: "@leom",
      time: "9m",
      initials: "LM",
      tone: "bg-[#BFDCE8] text-[#183E4B]",
      text: "This is a really useful suggestion. I’m going to try it too.",
      likes: 4,
    },
    {
      id: 3,
      name: "Mr. Adeyemi",
      handle: "@adeyemi_science",
      time: "3m",
      initials: "OA",
      tone: "bg-[#BDD8CC] text-[#153D33]",
      text: "Great discussion. Remember to explain your thinking clearly and keep the conversation respectful.",
      likes: 11,
    },
  ]);
  const [likedComments, setLikedComments] = useState<number[]>([]);

  const addComment = () => {
    if (!reply.trim()) return;
    setComments((current) => [
      ...current,
      {
        id: Date.now(),
        name: "Alex Morgan",
        handle: "@alexm",
        time: "now",
        initials: "AM",
        tone: "bg-[#F0C966] text-[#493407]",
        text: reply.trim(),
        likes: 0,
      },
    ]);
    setReply("");
    flash("Your comment was posted");
  };

  return (
    <>
      <header className="page-header">
        <button onClick={onBack} className="icon-button" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="page-title">Post</h1>
          <p className="text-xs text-muted">{comments.length} comments</p>
        </div>
      </header>

      <PostCard
        post={post}
        onLike={onLike}
        onBookmark={onBookmark}
        onOpen={() => undefined}
        onMenu={onMenu}
        flash={flash}
      />

      <section className="border-b border-line px-4 py-4 sm:px-6">
        <div className="flex gap-3">
          <Avatar text="AM" tone="bg-[#F0C966] text-[#493407]" size="md" />
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs text-muted">
              Commenting on <span className="font-semibold text-accent">{post.name}’s post</span>
            </p>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value.slice(0, 280))}
              rows={2}
              aria-label="Write a comment"
              placeholder="Write a comment…"
              className="field-control resize-y leading-6"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted">Text only · {280 - reply.length} left</span>
              <button
                onClick={addComment}
                disabled={!reply.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </section>

      <div>
        {comments.map((comment) => {
          const liked = likedComments.includes(comment.id);
          return (
            <article
              key={comment.id}
              className="border-b border-line px-4 py-5 hover:bg-soft sm:px-6"
            >
              <div className="flex gap-3">
                <div className="relative">
                  <Avatar text={comment.initials} tone={comment.tone} size="md" />
                  <span className="absolute inset-y-0 left-1/2 top-12 w-px -translate-x-1/2 bg-line" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <p className="truncate text-sm font-bold">{comment.name}</p>
                      <span className="text-xs text-muted">·</span>
                      <span className="shrink-0 text-xs text-muted">{comment.time}</span>
                    </div>
                    <button
                      onClick={() =>
                        onMenu({
                          name: comment.name,
                          handle: comment.handle,
                          kind: "comment",
                        })
                      }
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-tint hover:text-accent"
                      aria-label="Comment options"
                    >
                      <Ellipsis size={18} />
                    </button>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-ink">{comment.text}</p>
                  <div className="-ml-2 mt-2 flex items-center text-muted">
                    <button
                      onClick={() =>
                        setLikedComments((current) =>
                          liked
                            ? current.filter((id) => id !== comment.id)
                            : [...current, comment.id],
                        )
                      }
                      className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs hover:bg-[#FCECF0] hover:text-[#D34E6C] ${
                        liked ? "text-[#D34E6C]" : ""
                      }`}
                    >
                      <Heart size={16} fill={liked ? "currentColor" : "none"} />
                      {comment.likes + (liked ? 1 : 0)}
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

function ExplorePage({
  posts,
  onOpen,
  onViewProfile,
  flash,
}: {
  posts: Post[];
  onOpen: (post: Post) => void;
  onViewProfile: (profile: UserProfile) => void;
  flash: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchTab, setSearchTab] = useState<"Posts" | "People">("Posts");
  const normalizedQuery = query.trim().toLowerCase();
  const searchPeople = [...onlineFriends, ...people].filter(
    (person, index, all) => all.findIndex((item) => item.name === person.name) === index,
  );
  const matchingPeople = searchPeople.filter((person) =>
    person.name.toLowerCase().includes(normalizedQuery),
  );
  const matchingPosts = posts.filter(
    (post) =>
      post.text.toLowerCase().includes(normalizedQuery) ||
      post.name.toLowerCase().includes(normalizedQuery) ||
      post.tag?.toLowerCase().includes(normalizedQuery.replace("#", "")),
  );
  return (
    <>
      <PageHeader title="Explore" subtitle="Discover what’s happening at Westbridge" />
      <div className="border-b border-line px-4 py-4 sm:px-6">
        <label className="search-field">
          <Search size={19} className="text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchActive(true)}
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
            aria-label="Search Westbridge"
            placeholder="Search Westbridge"
          />
          {searchActive && (
            <button
              onClick={() => {
                setQuery("");
                setSearchActive(false);
              }}
              className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-line"
              aria-label="Close search"
            >
              <X size={15} />
            </button>
          )}
        </label>
        {searchActive && (
          <SectionTabs
            label="Search results"
            items={["Posts", "People"] as const}
            value={searchTab}
            onChange={setSearchTab}
          />
        )}
      </div>
      {searchActive && (
        <section className="min-h-64 px-4 py-5 sm:px-6">
          {!normalizedQuery ? (
            <div className="py-20 text-center">
              <Search size={28} className="mx-auto text-muted" />
              <p className="mt-3 font-bold">Search {searchTab.toLowerCase()}</p>
              <p className="mt-1 text-sm text-muted">
                {searchTab === "Posts"
                  ? "Find posts by words, names, or hashtags."
                  : "Find people by their display name."}
              </p>
            </div>
          ) : searchTab === "People" ? (
            matchingPeople.length > 0 ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {matchingPeople.map((person) => (
                  <button
                    key={person.name}
                    onClick={() =>
                      onViewProfile({
                        name: person.name,
                        handle: person.handle,
                        initials: person.initials,
                        tone: person.tone,
                        online: onlineFriends.some((friend) => friend.name === person.name),
                        status:
                          "status" in person && typeof person.status === "string"
                            ? person.status
                            : undefined,
                      })
                    }
                    className="flex items-center gap-3 rounded-xl border border-line p-3 text-left hover:bg-canvas"
                  >
                    <Avatar text={person.initials} tone={person.tone} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{person.name}</p>
                      <p className="text-xs text-muted">Westbridge School</p>
                    </div>
                    <ChevronRight size={16} className="text-muted" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <Search size={28} className="mx-auto text-muted" />
                <p className="mt-3 font-bold">No people found</p>
                <p className="mt-1 text-sm text-muted">Try a different display name.</p>
              </div>
            )
          ) : matchingPosts.length > 0 ? (
            <div className="-mx-4 -my-5 sm:-mx-6">
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
            <div className="py-20 text-center">
              <Search size={28} className="mx-auto text-muted" />
              <p className="mt-3 font-bold">No posts found</p>
              <p className="mt-1 text-sm text-muted">Try different words or a hashtag.</p>
            </div>
          )}
        </section>
      )}
      <section className={`${searchActive ? "hidden" : ""} border-b border-line py-4`}>
        <h2 className="px-4 text-lg font-bold sm:px-6">Trending now</h2>
        {trends.map((trend, index) => (
          <button
            key={trend.title}
            onClick={() => flash(`#${trend.title.replace(" ", "")} preview`)}
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-soft sm:px-6"
          >
            <span className="w-5 text-center text-xs font-bold text-muted">{index + 1}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">#{trend.title}</p>
              <p className="text-xs text-muted">{trend.posts}</p>
            </div>
            <ChevronRight size={18} className="text-muted" />
          </button>
        ))}
      </section>
    </>
  );
}

function FriendsPage({
  onViewProfile,
  flash,
}: {
  onViewProfile: (profile: UserProfile) => void;
  flash: (message: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"Friends" | "Requests" | "Sent">("Friends");
  const [friendQuery, setFriendQuery] = useState("");
  const [requests, setRequests] = useState([
    {
      name: "Jamie Reed",
      handle: "@jamiereed",
      initials: "JR",
      tone: "bg-[#C9DDF1] text-[#244B70]",
      mutual: "4 mutual friends",
    },
    {
      name: "Amara Okafor",
      handle: "@amarao",
      initials: "AO",
      tone: "bg-[#E8C8D9] text-[#573043]",
      mutual: "Maya and 6 others",
    },
  ]);
  const [sentRequests, setSentRequests] = useState([
    {
      name: "Daniel Kim",
      handle: "@danielk",
      initials: "DK",
      tone: "bg-[#D7E7C7] text-[#314D21]",
      mutual: "3 mutual friends",
      sent: "Sent today",
    },
    {
      name: "Priya Shah",
      handle: "@priyas",
      initials: "PS",
      tone: "bg-[#F0CFBE] text-[#5A3124]",
      mutual: "8 mutual friends",
      sent: "Sent yesterday",
    },
  ]);

  const normalizedFriendQuery = friendQuery.trim().toLowerCase();
  const friends: UserProfile[] = [
    ...onlineFriends.map((friend) => ({ ...friend, online: true })),
    ...people.slice(0, 2).map((friend) => ({ ...friend, online: false })),
  ];
  const matchingFriends = friends.filter(
    ({ name, handle }) =>
      name.toLowerCase().includes(normalizedFriendQuery) ||
      handle.toLowerCase().includes(normalizedFriendQuery),
  );

  const respond = (name: string, accepted: boolean) => {
    setRequests((current) => current.filter((request) => request.name !== name));
    flash(accepted ? `${name} is now your friend` : "Friend request removed");
  };

  return (
    <>
      <PageHeader
        title="Friends"
        subtitle="126 friends"
        action={
          <button
            onClick={() => flash("Friend settings")}
            className="icon-button"
            aria-label="Friend settings"
          >
            <Settings size={20} />
          </button>
        }
      />
      <SectionTabs
        label="Friends and requests"
        items={["Friends", "Requests", "Sent"] as const}
        value={activeTab}
        counts={{ Friends: 126, Requests: requests.length, Sent: sentRequests.length }}
        onChange={setActiveTab}
      />

      {activeTab === "Requests" && (
        <section className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Friend requests</h2>
            {requests.length > 0 && (
              <span className="rounded-lg bg-tint px-2.5 py-1 text-xs font-bold text-accent">
                {requests.length} new
              </span>
            )}
          </div>
          {requests.length ? (
            <div className="mt-3 space-y-2">
              {requests.map((request) => (
                <div
                  key={request.name}
                  className="flex items-center gap-3 rounded-xl border border-line p-3 sm:p-4"
                >
                  <Avatar text={request.initials} tone={request.tone} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{request.name}</p>
                    <p className="mt-1 text-xs text-accent">{request.mutual}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => respond(request.name, false)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-control text-muted hover:bg-soft"
                      aria-label={`Decline ${request.name}'s friend request`}
                    >
                      <UserX size={17} />
                    </button>
                    <button
                      onClick={() => respond(request.name, true)}
                      className="flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-xs font-bold text-white hover:bg-accent-hover"
                    >
                      <UserCheck size={16} /> Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-soft px-4 py-7 text-center">
              <UserCheck className="mx-auto text-[#2A8A65]" size={24} />
              <p className="mt-2 text-sm font-bold">You’re all caught up</p>
              <p className="mt-1 text-xs text-muted">No new friend requests</p>
            </div>
          )}
        </section>
      )}

      {activeTab === "Sent" && (
        <section className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Sent requests</h2>
              <p className="mt-0.5 text-xs text-muted">People you’re waiting to hear from</p>
            </div>
            {sentRequests.length > 0 && (
              <span className="rounded-lg bg-soft px-2.5 py-1 text-xs font-bold text-muted">
                {sentRequests.length} pending
              </span>
            )}
          </div>
          {sentRequests.length ? (
            <div className="mt-3 space-y-2">
              {sentRequests.map((request) => (
                <div
                  key={request.handle}
                  className="flex items-center gap-3 rounded-xl border border-line p-3 sm:p-4"
                >
                  <Avatar text={request.initials} tone={request.tone} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{request.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-muted">
                      <span>{request.mutual}</span>
                      <span>·</span>
                      <span>{request.sent}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSentRequests((current) =>
                        current.filter((item) => item.handle !== request.handle),
                      );
                      flash(`Request to ${request.name} cancelled`);
                    }}
                    className="rounded-lg border border-control px-3.5 py-2 text-xs font-bold text-muted hover:bg-soft"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-soft px-4 py-7 text-center">
              <UserPlus className="mx-auto text-muted" size={24} />
              <p className="mt-2 text-sm font-bold">No pending requests</p>
              <p className="mt-1 text-xs text-muted">Requests you send will appear here</p>
            </div>
          )}
        </section>
      )}

      {activeTab === "Friends" && (
        <section className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-bold">All friends</h2>
          <label className="mt-3 search-field">
            <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search friends"
              placeholder="Search by name or handle"
              value={friendQuery}
              onChange={(event) => setFriendQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base placeholder:text-muted"
            />
          </label>
          {matchingFriends.length === 0 && (
            <p role="status" className="mt-4 text-sm text-muted">
              No friends match your search.
            </p>
          )}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {matchingFriends.map((friend) => (
              <button
                key={friend.handle}
                onClick={() => onViewProfile(friend)}
                className="flex items-center gap-3 rounded-lg border border-line px-3 py-4 text-left hover:border-accent hover:bg-soft"
              >
                <div className="relative">
                  <Avatar text={friend.initials} tone={friend.tone} size="md" />
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#2AAF72]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{friend.name}</p>
                  <p className="truncate text-xs text-muted">
                    {friend.status ?? "12 mutual friends"}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function NotificationsPage({ navigate }: { navigate: (page: Page) => void }) {
  const notifications = [
    {
      icon: Heart,
      color: "bg-[#FCE9EE] text-[#D34E6C]",
      avatar: "MC",
      tone: "bg-[#E9A27B] text-[#4C271D]",
      text: "Maya Chen and 8 others liked your post.",
      time: "12m",
      note: "This revision method was really helpful—thank you!",
    },
    {
      icon: UserPlus,
      color: "bg-tint text-accent",
      avatar: "SB",
      tone: "bg-[#DCC8ED] text-[#432D58]",
      text: "Ms. Brooks sent you a friend request.",
      time: "1h",
    },
    {
      icon: MessageCircle,
      color: "bg-[#E8F5EF] text-[#26805E]",
      avatar: "OA",
      tone: "bg-[#BDD8CC] text-[#153D33]",
      text: "Mr. Adeyemi commented on your post.",
      time: "3h",
      note: "Excellent question—let’s discuss that in tomorrow’s lesson.",
    },
    {
      icon: Bell,
      color: "bg-[#FFF3D8] text-[#A36A00]",
      avatar: "W",
      tone: "bg-navy text-white",
      text: "Westbridge School published an update to the community guidelines.",
      time: "5h",
    },
  ];
  return (
    <>
      <PageHeader
        title="Notifications"
        action={
          <button
            onClick={() => navigate("Settings")}
            className="icon-button"
            aria-label="Notification settings"
          >
            <Settings size={20} />
          </button>
        }
      />
      <div>
        {notifications.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex w-full items-start gap-4 border-b border-line px-4 py-5 sm:px-6"
            >
              <div className="relative shrink-0">
                <Avatar text={item.avatar} tone={item.tone} size="md" />
                <span
                  className={`absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full ring-2 ring-white ${item.color}`}
                >
                  <Icon size={12} fill={item.icon === Heart ? "currentColor" : "none"} />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base leading-6 text-ink">
                  <span className="font-semibold">{item.text}</span>{" "}
                  <span className="text-muted">· {item.time}</span>
                </p>
                {item.note && (
                  <p className="mt-2 rounded-xl border border-line p-3 text-sm text-muted">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function MessagesPage({ flash }: { flash: (message: string) => void }) {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [conversationQuery, setConversationQuery] = useState("");
  const [sentMessages, setSentMessages] = useState<{ id: number; text: string }[]>([]);
  const selected = conversations[activeChat ?? 0];
  const filteredConversations = conversations
    .map((conversation, index) => ({ conversation, index }))
    .filter(({ conversation }) =>
      conversation.name.toLowerCase().includes(conversationQuery.trim().toLowerCase()),
    );
  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col md:min-h-[calc(100dvh-3rem)]">
      <div className={`${activeChat !== null ? "hidden sm:flex" : "flex"} flex-col sm:flex`}>
        <PageHeader
          title="Messages"
          action={
            <button
              onClick={() => flash("New message")}
              className="grid h-10 w-10 place-items-center rounded-full bg-tint text-accent"
              aria-label="New message"
            >
              <PenLine size={19} />
            </button>
          }
        />
        <div className="border-b border-line p-4">
          <label className="search-field">
            <Search size={17} className="text-muted" />
            <input
              value={conversationQuery}
              onChange={(event) => setConversationQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base outline-none"
              aria-label="Search conversations"
              placeholder="Search conversations"
            />
            {conversationQuery && (
              <button
                onClick={() => setConversationQuery("")}
                className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-line"
                aria-label="Clear conversation search"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>
      </div>
      <div className="min-h-0 flex-1 sm:grid sm:grid-cols-[minmax(12rem,36%)_minmax(0,1fr)]">
        <div
          className={`border-r border-line ${activeChat !== null ? "hidden sm:block" : "block"}`}
        >
          {filteredConversations.map(({ conversation: chat, index }) => (
            <button
              key={chat.name}
              onClick={() => setActiveChat(index)}
              className={`flex w-full items-center gap-3 border-b border-line px-4 py-4 text-left transition hover:bg-soft ${
                activeChat === index ? "bg-tint" : ""
              }`}
            >
              <div className="relative">
                <Avatar text={chat.initials} tone={chat.tone} size="lg" />
                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-[#2AAF72]" />
                )}
                {chat.unread && (
                  <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-accent" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-sm ${chat.unread ? "font-bold" : "font-bold"}`}>
                    {chat.name}
                  </p>
                  <span className="text-xs text-muted">{chat.time}</span>
                </div>
                <p
                  className={`mt-1 truncate text-xs ${
                    chat.unread ? "font-semibold text-muted" : "text-muted"
                  }`}
                >
                  {chat.preview}
                </p>
              </div>
            </button>
          ))}
          {filteredConversations.length === 0 && (
            <div className="px-5 py-14 text-center">
              <Search size={24} className="mx-auto text-muted" />
              <p className="mt-3 text-sm font-bold">No conversations found</p>
              <p className="mt-1 text-xs text-muted">Try another friend or group name.</p>
            </div>
          )}
        </div>
        <div
          className={`${activeChat === null ? "hidden sm:flex" : "flex"} min-w-0 min-h-[28rem] flex-col`}
        >
          <div className="flex h-[68px] items-center gap-3 border-b border-line px-4">
            <button
              onClick={() => setActiveChat(null)}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-soft sm:hidden"
              aria-label="Back to messages"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="relative">
              <Avatar text={selected.initials} tone={selected.tone} size="sm" />
              {selected.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#2AAF72]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{selected.name}</p>
              <p className={`text-xs ${selected.online ? "text-[#208A60]" : "text-muted"}`}>
                {selected.online ? "Active now" : "Offline"}
              </p>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-soft">
              <Ellipsis size={19} />
            </button>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-end gap-3 break-words bg-soft p-4 sm:p-5">
            <p className="mb-3 text-center text-xs text-muted">Today, 10:36am</p>
            <div className="max-w-[82%] self-start rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-5 text-ink shadow-sm ring-1 ring-line">
              Hi Alex! Did you understand question four in the science homework?
            </div>
            <div className="max-w-[82%] self-end rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm leading-5 text-white">
              I think so. I used the example from today’s lesson.
            </div>
            <div className="max-w-[82%] self-start rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-5 text-ink shadow-sm ring-1 ring-line">
              That makes sense now, thank you!
            </div>
            {sentMessages.map((sentMessage) => (
              <div key={sentMessage.id} className="flex max-w-[86%] flex-col items-end self-end">
                <div className="rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm leading-5 text-white">
                  {sentMessage.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={1}
                aria-label="Write a message"
                placeholder="Write a message…"
                className="field-control min-h-11 min-w-0 flex-1 resize-none"
              />
              <button
                onClick={() => {
                  if (message.trim()) {
                    setSentMessages((current) => [
                      ...current,
                      {
                        id: Date.now(),
                        text: message.trim(),
                      },
                    ]);
                    setMessage("");
                    flash("Message sent");
                  }
                }}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white disabled:opacity-40"
                aria-label="Send message"
                disabled={!message.trim()}
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookmarksPage({
  posts,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: {
  posts: Post[];
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const saved = posts.filter((post) => post.bookmarked);
  return (
    <>
      <PageHeader
        title="Bookmarks"
        subtitle={`${saved.length} saved posts`}
        action={
          <button
            aria-label="Bookmark options"
            onClick={() => flash("Bookmark options")}
            className="icon-button"
          >
            <Ellipsis size={20} />
          </button>
        }
      />
      <div className="border-b border-line px-4 py-4 sm:px-6">
        <label className="search-field">
          <Search size={17} className="text-muted" />
          <input
            className="min-w-0 flex-1 bg-transparent text-base outline-none"
            aria-label="Search bookmarks"
            placeholder="Search bookmarks"
          />
        </label>
      </div>
      {saved.length ? (
        saved.map((post) => (
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
        <div className="mx-auto max-w-sm px-8 py-20 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-tint text-accent">
            <Bookmark size={28} />
          </div>
          <h2 className="mt-5 text-xl font-bold">Save posts for later</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Bookmark any useful announcement, resource or update and it will appear here.
          </p>
        </div>
      )}
    </>
  );
}

function ProfilePage({
  posts,
  navigate,
  onLike,
  onBookmark,
  onOpen,
  onMenu,
  flash,
}: {
  posts: Post[];
  navigate: (page: Page) => void;
  onLike: (id: number) => void;
  onBookmark: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const [tab, setTab] = useState("Posts");
  const [editOpen, setEditOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Morgan",
    bio: "Music, science and reading.",
    year: "Year 11",
    house: "Ash House",
  });
  const [editDraft, setEditDraft] = useState(profileData);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const ownPosts = posts.filter((post) => post.handle === "@alexm");
  const profileInitials = profileData.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const ownReplies = [
    {
      id: 1,
      postId: 2,
      target: "Maya Chen",
      time: "31m",
      text: "I use a short phrase for each stage, then test myself without looking at my notes.",
    },
    {
      id: 2,
      postId: 3,
      target: "Mr. Adeyemi",
      time: "1h",
      text: "Thanks, the example layout made the field notes much clearer.",
    },
  ];
  return (
    <>
      <PageHeader
        title="Profile"
        subtitle={`${ownPosts.length || 12} posts`}
        action={
          <button
            aria-label="Open settings"
            onClick={() => navigate("Settings")}
            className="icon-button"
          >
            <Settings size={20} />
          </button>
        }
      />
      {editOpen && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!editDraft.name.trim()) return;
            setProfileData({
              ...editDraft,
              name: editDraft.name.trim(),
              bio: editDraft.bio.trim(),
            });
            setProfileAvatar(editAvatar);
            setEditOpen(false);
            flash("Profile updated");
          }}
          className="border-b border-line bg-white"
        >
          <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
            <div>
              <h2 tabIndex={-1} ref={focusInlineHeading} className="text-lg font-bold">
                Edit profile
              </h2>
              <p className="mt-0.5 text-xs text-muted">Update how others see you</p>
            </div>
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-soft"
              aria-label="Close edit profile"
            >
              <X size={19} />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-4 rounded-2xl bg-soft p-4">
              {editAvatar ? (
                <img
                  src={editAvatar}
                  alt="New avatar preview"
                  className="h-14 w-14 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
                />
              ) : (
                <Avatar
                  text={
                    editDraft.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase() || "AM"
                  }
                  tone="bg-[#F0C966] text-[#493407]"
                  size="lg"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">Profile avatar</p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  JPG, PNG or WebP. Maximum file size 5 MB.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-hover">
                    {editAvatar ? "Change avatar" : "Upload avatar"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          flash("Avatar must be smaller than 5 MB");
                          event.target.value = "";
                          return;
                        }
                        setEditAvatar(URL.createObjectURL(file));
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {editAvatar && (
                    <button
                      type="button"
                      onClick={() => setEditAvatar(null)}
                      className="px-2 py-1.5 text-xs font-bold text-danger hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <label className="mt-5 block">
              <span className="text-xs font-bold text-muted">Display name</span>
              <input
                value={editDraft.name}
                onChange={(event) =>
                  setEditDraft((current) => ({
                    ...current,
                    name: event.target.value.slice(0, 40),
                  }))
                }
                required
                className="field-control mt-2"
                placeholder="Your name"
              />
              <span className="mt-1.5 block text-right text-xs text-muted">
                {editDraft.name.length}/40
              </span>
            </label>

            <label className="mt-3 block">
              <span className="text-xs font-bold text-muted">Bio</span>
              <textarea
                value={editDraft.bio}
                onChange={(event) =>
                  setEditDraft((current) => ({
                    ...current,
                    bio: event.target.value.slice(0, 120),
                  }))
                }
                rows={3}
                className="field-control mt-2 resize-y"
                placeholder="Tell your friends a little about yourself"
              />
              <span className="mt-1.5 block text-right text-xs text-muted">
                {editDraft.bio.length}/120
              </span>
            </label>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-muted">Year group</span>
                <select
                  value={editDraft.year}
                  onChange={(event) =>
                    setEditDraft((current) => ({ ...current, year: event.target.value }))
                  }
                  className="field-control mt-2"
                >
                  {["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13"].map(
                    (year) => (
                      <option key={year}>{year}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-muted">House</span>
                <select
                  value={editDraft.house}
                  onChange={(event) =>
                    setEditDraft((current) => ({ ...current, house: event.target.value }))
                  }
                  className="field-control mt-2"
                >
                  {["Ash House", "Cedar House", "Elm House", "Oak House"].map((house) => (
                    <option key={house}>{house}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-line bg-white p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="rounded-xl border border-control px-5 py-3 text-sm font-bold text-muted hover:bg-soft"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!editDraft.name.trim()}
              className="rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-hover disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </form>
      )}
      <div className="profile-intro">
        <div className="flex items-end justify-between">
          {profileAvatar ? (
            <img
              src={profileAvatar}
              alt={`${profileData.name} avatar`}
              className="h-24 w-24 rounded-full object-cover shadow-sm ring-2 ring-white"
            />
          ) : (
            <Avatar text={profileInitials || "AM"} tone="bg-[#F0C966] text-[#493407]" size="xl" />
          )}
          <button
            onClick={() => {
              setEditDraft(profileData);
              setEditAvatar(profileAvatar);
              setEditOpen(true);
            }}
            className="mb-1 rounded-lg border border-control bg-white px-4 py-2 text-sm font-bold hover:bg-soft"
          >
            Edit profile
          </button>
        </div>
        <h2 className="mt-3 text-xl font-bold">{profileData.name}</h2>
        <p className="mt-4 text-sm leading-6 text-ink">{profileData.bio}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> Westbridge School
          </span>
          <span>
            {profileData.year} · {profileData.house}
          </span>
        </div>
        <div className="mt-4 flex gap-5 text-sm">
          <button onClick={() => navigate("Friends")}>
            <strong>126</strong> <span className="text-muted">Friends</span>
          </button>
        </div>
        <button
          onClick={() => navigate("Bookmarks")}
          className="mt-5 flex w-full items-center justify-between rounded-xl bg-soft px-4 py-3 text-left sm:hidden"
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <Bookmark size={18} className="text-accent" /> Saved posts
          </span>
          <ChevronRight size={18} className="text-muted" />
        </button>
      </div>
      <SectionTabs
        label="Profile activity"
        items={["Posts", "Replies", "Likes"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Posts" &&
        (ownPosts.length ? (
          ownPosts.map((post) => (
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
          <div className="px-6 py-14 text-center">
            <p className="font-bold">Your posts will appear here</p>
            <p className="mt-1 text-sm text-muted">Share an update from the Home page.</p>
          </div>
        ))}

      {tab === "Replies" && (
        <div>
          {ownReplies.map((item) => {
            const originalPost = posts.find((post) => post.id === item.postId);
            return (
              <article key={item.id} className="border-b border-line px-4 py-5 sm:px-6">
                <div className="flex gap-3">
                  <Avatar text="AM" tone="bg-[#F0C966] text-[#493407]" size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <p className="truncate text-sm font-bold">Alex Morgan</p>
                          <span className="text-xs text-muted">·</span>
                          <span className="shrink-0 text-xs text-muted">{item.time}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          Commented on{" "}
                          <button
                            onClick={() => originalPost && onOpen(originalPost)}
                            className="font-semibold text-accent hover:underline"
                          >
                            {item.target}’s post
                          </button>
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          onMenu({
                            name: "Alex Morgan",
                            handle: "@alexm",
                            kind: "comment",
                          })
                        }
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-tint hover:text-accent"
                        aria-label="Comment options"
                      >
                        <Ellipsis size={18} />
                      </button>
                    </div>
                    <p className="mt-2 text-[15px] leading-6 text-ink">{item.text}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                      <Heart size={16} /> {item.id === 1 ? 5 : 2}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {tab === "Likes" && (
        <div>
          {posts
            .filter((post) => post.liked)
            .map((post) => (
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
        </div>
      )}
    </>
  );
}

function SettingsPage({
  navigate,
  flash,
  onSignOut,
}: {
  navigate: (page: Page) => void;
  flash: (message: string) => void;
  onSignOut: () => void;
}) {
  const [openSection, setOpenSection] = useState<"email" | "password" | "sessions" | null>(null);
  const [email, setEmail] = useState("alex.morgan@westbridge.school");
  const [savedEmail, setSavedEmail] = useState(email);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "London, UK",
      active: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "London, UK",
      active: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Chrome on Chromebook",
      location: "Westbridge School",
      active: "Yesterday",
      current: false,
    },
  ]);
  const passwordValid =
    passwords.current.length > 0 &&
    passwords.next.length >= 8 &&
    passwords.next === passwords.confirm;

  return (
    <>
      <header className="page-header">
        <button
          onClick={() => {
            if (openSection) {
              setOpenSection(null);
            } else {
              navigate("Profile");
            }
          }}
          className="icon-button"
          aria-label="Back to profile"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="page-title">
            {openSection === "email"
              ? "Email address"
              : openSection === "password"
                ? "Change password"
                : openSection === "sessions"
                  ? "Active sessions"
                  : "Settings"}
          </h1>
          <p className="text-xs text-muted">
            {openSection ? "Account settings" : "Account and security"}
          </p>
        </div>
      </header>

      <div className="space-y-3 p-4 sm:p-6">
        {(openSection === null || openSection === "email") && (
          <section className="overflow-hidden rounded-lg border border-line bg-white">
            <button
              onClick={() => setOpenSection(openSection === "email" ? null : "email")}
              className={`flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5 ${
                openSection === "email" ? "border-b border-line" : ""
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-tint text-accent">
                <Mail size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">Email address</h2>
                <p className="mt-0.5 truncate text-xs text-muted">{savedEmail}</p>
              </div>
              <ChevronRight
                size={18}
                className={`text-muted transition ${
                  openSection === "email" ? "rotate-90 text-accent" : ""
                }`}
              />
            </button>
            {openSection === "email" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSavedEmail(email.trim());
                  flash("Email address updated");
                }}
                className="p-4 sm:p-5"
              >
                <label className="block">
                  <span className="text-xs font-bold text-muted">School email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="field-control mt-2"
                  />
                </label>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted">
                    {email === savedEmail ? "Your email is up to date" : "You have unsaved changes"}
                  </p>
                  <button
                    type="submit"
                    disabled={!email.trim() || email === savedEmail}
                    className="rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-white hover:bg-accent-hover disabled:opacity-40"
                  >
                    Save email
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {(openSection === null || openSection === "password") && (
          <section className="overflow-hidden rounded-lg border border-line bg-white">
            <button
              onClick={() => setOpenSection(openSection === "password" ? null : "password")}
              className={`flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5 ${
                openSection === "password" ? "border-b border-line" : ""
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F1ECFA] text-[#7253A3]">
                <KeyRound size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">Change password</h2>
                <p className="mt-0.5 truncate text-xs text-muted">Update your account password</p>
              </div>
              <ChevronRight
                size={18}
                className={`text-muted transition ${
                  openSection === "password" ? "rotate-90 text-[#7253A3]" : ""
                }`}
              />
            </button>
            {openSection === "password" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!passwordValid) return;
                  setPasswords({ current: "", next: "", confirm: "" });
                  flash("Password updated");
                }}
                className="space-y-4 p-4 sm:p-5"
              >
                <label className="block">
                  <span className="text-xs font-bold text-muted">Current password</span>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(event) =>
                      setPasswords((current) => ({ ...current, current: event.target.value }))
                    }
                    className="field-control mt-2"
                    autoComplete="current-password"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold text-muted">New password</span>
                    <input
                      type="password"
                      value={passwords.next}
                      onChange={(event) =>
                        setPasswords((current) => ({ ...current, next: event.target.value }))
                      }
                      className="field-control mt-2"
                      autoComplete="new-password"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-muted">Confirm password</span>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(event) =>
                        setPasswords((current) => ({ ...current, confirm: event.target.value }))
                      }
                      className="field-control mt-2"
                      autoComplete="new-password"
                    />
                  </label>
                </div>
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <ShieldCheck size={15} className="text-[#2A8A65]" />
                    At least 8 characters and both passwords must match
                  </div>
                  <button
                    type="submit"
                    disabled={!passwordValid}
                    className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-40"
                  >
                    Update password
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {(openSection === null || openSection === "sessions") && (
          <section className="overflow-hidden rounded-lg border border-line bg-white">
            <button
              onClick={() => setOpenSection(openSection === "sessions" ? null : "sessions")}
              className={`flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5 ${
                openSection === "sessions" ? "border-b border-line" : ""
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E8F6EF] text-[#23805C]">
                <Laptop size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">Active sessions</h2>
                <p className="mt-0.5 text-xs text-muted">
                  {sessions.length} {sessions.length === 1 ? "device" : "devices"} signed in
                </p>
              </div>
              <ChevronRight
                size={18}
                className={`text-muted transition ${
                  openSection === "sessions" ? "rotate-90 text-[#23805C]" : ""
                }`}
              />
            </button>
            {openSection === "sessions" && (
              <>
                <div>
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 border-b border-[#EDF0F4] px-4 py-4 last:border-b-0 sm:px-5"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-soft text-muted">
                        <Laptop size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-bold">{session.device}</p>
                          {session.current && (
                            <span className="rounded-lg bg-[#E8F6EF] px-2 py-0.5 text-xs font-bold text-[#23805C]">
                              This device
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-muted">
                          {session.location} · {session.active}
                        </p>
                      </div>
                      {!session.current && (
                        <button
                          onClick={() => {
                            setSessions((current) =>
                              current.filter((item) => item.id !== session.id),
                            );
                            flash(`${session.device} logged out`);
                          }}
                          className="rounded-lg border border-[#D2DAE4] px-3 py-2 text-xs font-bold text-muted hover:border-[#E2B9B9] hover:bg-[#FFF4F4] hover:text-danger"
                        >
                          Log out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {sessions.filter((session) => !session.current).length > 0 && (
                  <div className="border-t border-line p-4">
                    <button
                      onClick={() => {
                        setSessions((current) => current.filter((session) => session.current));
                        flash("Other sessions logged out");
                      }}
                      className="w-full rounded-xl border border-[#E3BDBD] py-2.5 text-xs font-bold text-danger hover:bg-[#FFF4F4]"
                    >
                      Log out all other sessions
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {openSection === null && (
          <section className="rounded-xl border border-[#F0CECE] bg-white p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold">Log out of this account</h2>
                <p className="mt-1 text-xs leading-5 text-muted">
                  You will need your email and password to sign in again.
                </p>
              </div>
              <button
                onClick={onSignOut}
                className="flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-bold text-white hover:bg-danger-hover"
              >
                <LogOut size={17} /> Log out
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function OtherProfilePage({
  profile,
  onBack,
  navigate,
  flash,
}: {
  profile: UserProfile;
  onBack: () => void;
  navigate: (page: Page) => void;
  flash: (message: string) => void;
}) {
  const [tab, setTab] = useState("Posts");
  const [friendship, setFriendship] = useState<"friends" | "pending" | "none">("friends");
  const [showFriendActions, setShowFriendActions] = useState(false);

  return (
    <>
      <header className="page-header">
        <button onClick={onBack} className="icon-button" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="page-title">Profile</h1>
          <p className="text-xs text-muted">18 posts</p>
        </div>
        <button
          onClick={() => flash("Profile options")}
          className="icon-button"
          aria-label="Profile options"
        >
          <Ellipsis size={20} />
        </button>
      </header>

      <div className="profile-intro">
        <div className="flex items-end justify-between">
          <div className="relative">
            <Avatar text={profile.initials} tone={profile.tone} size="xl" />
            {profile.online && (
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-[#2AAF72]" />
            )}
          </div>
          <div className="relative mb-1 flex items-center gap-2">
            <button
              onClick={() => {
                navigate("Messages");
                flash(`Opening chat with ${profile.name}`);
              }}
              className="grid h-10 w-10 place-items-center rounded-lg border border-control bg-white text-ink hover:bg-soft"
              aria-label={`Message ${profile.name}`}
            >
              <Mail size={18} />
            </button>
            <button
              onClick={() => {
                if (friendship === "friends") setShowFriendActions((shown) => !shown);
                if (friendship === "none") {
                  setFriendship("pending");
                  flash(`Friend request sent to ${profile.name}`);
                }
                if (friendship === "pending") {
                  setFriendship("none");
                  flash("Friend request cancelled");
                }
              }}
              aria-expanded={friendship === "friends" ? showFriendActions : undefined}
              className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
                friendship === "friends"
                  ? "border border-control bg-white text-ink hover:bg-soft"
                  : friendship === "pending"
                    ? "border border-control bg-white text-muted"
                    : "bg-accent text-white hover:bg-accent-hover"
              }`}
            >
              {friendship === "friends" ? (
                <UserCheck size={17} />
              ) : friendship === "none" ? (
                <UserPlus size={17} />
              ) : null}
              {friendship === "friends"
                ? "Friends"
                : friendship === "pending"
                  ? "Requested"
                  : "Add friend"}
            </button>
          </div>
        </div>

        {showFriendActions && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
            <button
              onClick={() => {
                setShowFriendActions(false);
                navigate("Messages");
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold hover:bg-soft"
            >
              <MessageCircle size={16} /> Send message
            </button>
            <button
              onClick={() => {
                setFriendship("none");
                setShowFriendActions(false);
                flash(`${profile.name} was removed from friends`);
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-danger hover:bg-[#FFF0F0]"
            >
              <UserX size={16} /> Remove friend
            </button>
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          {profile.online && (
            <span className="rounded-lg bg-[#E8F6EF] px-2 py-1 text-xs font-bold text-[#23805C]">
              Online
            </span>
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-ink">
          Year 11 · Cedar House · Interested in science, books and student voice.
        </p>
        {profile.status && (
          <p className="mt-2 text-xs font-medium text-[#23805C]">{profile.status}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> Westbridge School
          </span>
          <span>12 mutual friends</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            <Avatar text="LM" tone="bg-[#BFDCE8] text-[#183E4B]" size="sm" />
            <Avatar text="SP" tone="bg-[#F1D8B6] text-[#543A18]" size="sm" />
            <Avatar text="NW" tone="bg-[#DCC8ED] text-[#432D58]" size="sm" />
          </div>
          <p className="text-xs text-muted">
            Friends with <strong className="text-ink">Leo, Sofia</strong> and 10 others
          </p>
        </div>
      </div>

      <SectionTabs
        label="Profile sections"
        items={["Posts", "About", "Friends"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Posts" && (
        <div>
          <article className="border-b border-line px-4 py-5 sm:px-6">
            <div className="flex gap-3">
              <div className="relative">
                <Avatar text={profile.initials} tone={profile.tone} size="lg" />
                {profile.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#2AAF72]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-bold">{profile.name}</p>
                  <span className="text-xs text-muted">· 32m</span>
                </div>
                <p className="mt-2 text-[15px] leading-6 text-ink">
                  What revision method works best for you when a topic has lots of new terms?
                </p>
                <div className="mt-3 flex max-w-[280px] items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={16} /> 8
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart size={16} /> 21
                  </span>
                  <Bookmark size={16} />
                </div>
              </div>
            </div>
          </article>
        </div>
      )}

      {tab === "About" && (
        <div className="space-y-4 p-4 sm:p-6">
          <section className="rounded-xl border border-line p-4">
            <h3 className="font-bold">About {profile.name.split(" ")[0]}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Student at Westbridge School. This profile is visible to confirmed friends and members
              of the school network.
            </p>
          </section>
          <section className="rounded-xl border border-line p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Friendship</p>
            <p className="mt-2 text-sm font-bold">Friends since September 2023</p>
          </section>
        </div>
      )}

      {tab === "Friends" && (
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-bold">Mutual friends</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {onlineFriends.slice(1, 4).map((friend) => (
              <button
                key={friend.name}
                onClick={() => flash(`${friend.name}'s profile`)}
                className="flex items-center gap-3 rounded-xl border border-line p-3 text-left hover:bg-canvas"
              >
                <Avatar text={friend.initials} tone={friend.tone} size="md" />
                <div>
                  <p className="text-sm font-bold">{friend.name}</p>
                  <p className="text-xs text-muted">Mutual friend</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function OptionsMenu({
  target,
  onClose,
  onDeleteRequest,
  flash,
}: {
  target: MenuTarget;
  onClose: () => void;
  onDeleteRequest: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const ownContent = target.handle === "@alexm";
  const choose = (message: string) => {
    onClose();
    flash(message);
  };
  return (
    <section className="border-b border-line bg-soft p-4 sm:px-6">
      <div className="flex items-center justify-between px-2 py-2">
        <div>
          <h2 tabIndex={-1} ref={focusInlineHeading} className="text-base font-bold">
            {target.kind === "post" ? "Post options" : "Comment options"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-soft"
          aria-label="Close options"
        >
          <X size={19} />
        </button>
      </div>
      <div className="my-1 h-px bg-line" />
      {ownContent ? (
        <button
          onClick={() => {
            if (target.kind === "post") {
              onClose();
              onDeleteRequest(target);
            } else {
              choose("Delete comment confirmation");
            }
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-semibold text-danger hover:bg-[#FFF0F0]"
        >
          <Trash2 size={19} />
          Delete {target.kind}
        </button>
      ) : (
        <>
          <button
            onClick={() => choose(`You will see fewer posts like this`)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-semibold hover:bg-soft"
          >
            <BellOff size={19} className="text-muted" />
            Not interested in this
          </button>
        </>
      )}
      <button
        onClick={() => choose("Link copied")}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-semibold hover:bg-soft"
      >
        <Send size={19} className="text-muted" />
        Copy link
      </button>
    </section>
  );
}

function DeleteConfirmation({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <section
      className="border-b border-line bg-[#FFF8F8] p-4 sm:px-6"
      aria-labelledby="delete-post-title"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF0F0] text-danger">
        <Trash2 size={22} />
      </div>
      <h2
        id="delete-post-title"
        tabIndex={-1}
        ref={focusInlineHeading}
        className="mt-4 text-xl font-bold tracking-[-0.02em]"
      >
        Delete this post?
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        This will permanently remove the post, its likes, and all comments. This action cannot be
        undone.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          onClick={onCancel}
          className="rounded-xl border border-control px-5 py-3 text-sm font-bold text-muted hover:bg-soft"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-xl bg-danger px-5 py-3 text-sm font-bold text-white hover:bg-danger-hover"
        >
          Delete post
        </button>
      </div>
    </section>
  );
}

function SearchResultsPage({
  posts,
  onBack,
  onOpenPost,
  onOpenProfile,
}: {
  posts: Post[];
  onBack: () => void;
  onOpenPost: (post: Post) => void;
  onOpenProfile: (profile: UserProfile) => void;
}) {
  const [tab, setTab] = useState<"Posts" | "People">("Posts");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const searchablePeople = [...onlineFriends, ...people].filter(
    (person, index, all) => all.findIndex((item) => item.name === person.name) === index,
  );
  const peopleResults = searchablePeople.filter((person) =>
    person.name.toLowerCase().includes(normalizedQuery),
  );
  const postResults = posts.filter(
    (post) =>
      post.text.toLowerCase().includes(normalizedQuery) ||
      post.name.toLowerCase().includes(normalizedQuery) ||
      post.tag?.toLowerCase().includes(normalizedQuery.replace("#", "")),
  );

  return (
    <div className="flex min-h-[calc(100dvh-9rem)] flex-col md:min-h-[calc(100dvh-3rem)] bg-white">
      <div className="flex flex-1 flex-col">
        <header className="page-header">
          <button onClick={onBack} className="icon-button" aria-label="Close search">
            <ArrowLeft size={20} />
          </button>
          <label className="min-w-0 flex-1 search-field">
            <Search size={18} className="text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base outline-none"
              aria-label="Search Westbridge"
              placeholder="Search Westbridge"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-[#DDE5ED]"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </header>
        <SectionTabs
          label="Search results"
          items={["Posts", "People"] as const}
          value={tab}
          onChange={setTab}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          {!normalizedQuery ? (
            <div className="px-6 py-24 text-center">
              <Search size={30} className="mx-auto text-muted" />
              <h2 className="mt-4 text-lg font-bold">Search {tab.toLowerCase()}</h2>
              <p className="mt-1 text-sm text-muted">
                {tab === "Posts"
                  ? "Find posts by words, names, or hashtags."
                  : "Find people by their display name."}
              </p>
            </div>
          ) : tab === "Posts" ? (
            postResults.length ? (
              postResults.map((post) => (
                <button
                  key={post.id}
                  onClick={() => {
                    onOpenPost(post);
                  }}
                  className="block w-full border-b border-line px-5 py-4 text-left hover:bg-canvas"
                >
                  <div className="flex items-center gap-3">
                    <Avatar text={post.avatar} tone={post.avatarTone} size="sm" />
                    <div>
                      <p className="text-sm font-bold">{post.name}</p>
                      <p className="text-xs text-muted">{post.time}</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink">{post.text}</p>
                </button>
              ))
            ) : (
              <div className="px-6 py-24 text-center">
                <p className="font-bold">No posts found</p>
                <p className="mt-1 text-sm text-muted">Try different words or a hashtag.</p>
              </div>
            )
          ) : peopleResults.length ? (
            <div className="grid gap-2 p-4 sm:grid-cols-2">
              {peopleResults.map((person) => {
                const online = onlineFriends.some((friend) => friend.name === person.name);
                return (
                  <button
                    key={person.name}
                    onClick={() => {
                      onOpenProfile({
                        name: person.name,
                        handle: person.handle,
                        initials: person.initials,
                        tone: person.tone,
                        online,
                        status:
                          "status" in person && typeof person.status === "string"
                            ? person.status
                            : undefined,
                      });
                    }}
                    className="flex items-center gap-3 rounded-xl border border-line p-3 text-left hover:bg-canvas"
                  >
                    <div className="relative">
                      <Avatar text={person.initials} tone={person.tone} size="md" />
                      {online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#2AAF72]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{person.name}</p>
                      <p className="text-xs text-muted">
                        {online ? "Online" : "Westbridge School"}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-muted" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-24 text-center">
              <p className="font-bold">No people found</p>
              <p className="mt-1 text-sm text-muted">Try a different display name.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RightRail({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <aside className="discussions-rail">
      <div className="space-y-6">
        <section>
          <h2 className="border-b border-line pb-3 text-base font-bold tracking-tight">
            Popular discussions
          </h2>
          {trends.slice(0, 3).map((trend) => (
            <button
              key={trend.title}
              onClick={() => navigate("Explore")}
              className="flex w-full items-center justify-between gap-2 border-b border-line py-3.5 text-left hover:text-accent"
            >
              <span className="min-w-0 break-words text-sm font-semibold">#{trend.title}</span>
              <span className="shrink-0 text-xs text-muted">{trend.posts}</span>
            </button>
          ))}
          <button
            onClick={() => navigate("Explore")}
            className="mt-1 rounded-sm py-2 text-sm font-semibold text-accent hover:underline"
          >
            Show more
          </button>
        </section>
        <p className="text-xs leading-5 text-muted">
          Community guidelines · Privacy · Accessibility
          <br />© 2025 Westbridge School
        </p>
      </div>
    </aside>
  );
}

function pageFromLocation(): Page {
  const page = window.history.state?.westbridgePage;
  if (page === "Account" || navItems.some((item) => item.label === page) || page === "Search")
    return page;
  return "Home";
}

export default function App() {
  return (
    <SessionGate>
      {(email, signOut) => <CommunityApp accountEmail={email} signOut={signOut} />}
    </SessionGate>
  );
}

function CommunityApp({
  accountEmail,
  signOut,
}: {
  accountEmail: string | null;
  signOut: () => void;
}) {
  const [activePage, setActivePage] = useState<Page>(pageFromLocation);
  const profileMenuRef = useRef<HTMLDialogElement>(null);
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [menuTarget, setMenuTarget] = useState<MenuTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuTarget | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) profileMenuRef.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const flash = (message: string) => {
    setStatus(message);
  };

  const showPage = useCallback((page: Page) => {
    profileMenuRef.current?.close();
    setSelectedPost(null);
    setViewedProfile(null);
    setActivePage(page);
    setCreatingPost(false);
    setMenuTarget(null);
    setDeleteTarget(null);
    setStatus("");
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const handleLocationChange = () => showPage(pageFromLocation());
    window.addEventListener("hashchange", handleLocationChange);
    return () => window.removeEventListener("hashchange", handleLocationChange);
  }, [showPage]);

  const navigate = (page: Page) => {
    window.history.replaceState({ ...window.history.state, westbridgePage: page }, "");
    showPage(page);
  };

  const accountPage = (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="page-title">Account</h1>
      <p className="mt-2 text-sm text-muted [overflow-wrap:anywhere]">
        {accountEmail ? `Signed in as ${accountEmail}` : "Previewing as Alex Morgan"}
      </p>
      <button
        type="button"
        onClick={signOut}
        className="mt-5 rounded-lg border border-control px-4 py-2.5 text-sm font-semibold hover:bg-soft"
      >
        Sign out
      </button>
    </section>
  );

  const openCreatePost = () => setCreatingPost(true);

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setMenuTarget(null);
    setDeleteTarget(null);
    setStatus("");
    window.scrollTo({ top: 0 });
  };

  const toggleLike = (id: number) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
          : post,
      ),
    );
  };

  const toggleBookmark = (id: number) => {
    setPosts((current) =>
      current.map((post) => (post.id === id ? { ...post, bookmarked: !post.bookmarked } : post)),
    );
  };

  const publish = () => {
    if (!draft.trim()) return;
    setPosts((current) => [
      {
        id: Date.now(),
        name: "Alex Morgan",
        handle: "@alexm",
        time: "now",
        avatar: "AM",
        avatarTone: "bg-[#F0C966] text-[#493407]",
        text: draft.trim(),
        replies: 0,
        likes: 0,
      },
      ...current,
    ]);
    setDraft("");
    setCreatingPost(false);
    flash("Your post was shared");
  };

  const pageContent = {
    Home: (
      <HomePage
        posts={posts}
        onLike={toggleLike}
        onBookmark={toggleBookmark}
        onOpen={openPost}
        onMenu={setMenuTarget}
        flash={flash}
      />
    ),
    Explore: (
      <ExplorePage posts={posts} onOpen={openPost} onViewProfile={setViewedProfile} flash={flash} />
    ),
    Friends: <FriendsPage onViewProfile={setViewedProfile} flash={flash} />,
    Notifications: <NotificationsPage navigate={navigate} />,
    Messages: <MessagesPage flash={flash} />,
    Bookmarks: (
      <BookmarksPage
        posts={posts}
        onLike={toggleLike}
        onBookmark={toggleBookmark}
        onOpen={openPost}
        onMenu={setMenuTarget}
        flash={flash}
      />
    ),
    Profile: (
      <ProfilePage
        posts={posts}
        navigate={navigate}
        onLike={toggleLike}
        onBookmark={toggleBookmark}
        onOpen={openPost}
        onMenu={setMenuTarget}
        flash={flash}
      />
    ),
    Settings: <SettingsPage navigate={navigate} flash={flash} onSignOut={signOut} />,
    Account: accountPage,
    Search: (
      <SearchResultsPage
        posts={posts}
        onBack={() => navigate("Home")}
        onOpenPost={openPost}
        onOpenProfile={setViewedProfile}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="community-masthead">
        <div className="masthead-inner">
          <button
            type="button"
            onClick={() => navigate("Home")}
            aria-label="Westbridge Connect home"
          >
            <SchoolBrand />
          </button>
          <button
            type="button"
            onClick={() => navigate("Search")}
            aria-label="Search Westbridge"
            className="masthead-search"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search Westbridge</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("Profile")}
            className="hidden min-w-0 items-center gap-2.5 rounded-lg p-1 text-left hover:bg-soft md:flex"
            aria-label="View Alex Morgan’s profile"
          >
            <Avatar text="AM" tone="bg-[#F0C966] text-[#493407]" size="sm" />
            <span className="hidden lg:block">
              <span className="block text-sm font-bold">Alex Morgan</span>
              <span className="block text-xs text-muted">Year 11 · Ash House</span>
            </span>
          </button>
        </div>
      </header>
      <div className="community-layout">
        <aside className="community-nav">
          <div className="flex h-full items-center justify-around md:flex-col md:items-stretch md:justify-start">
            <nav className="flex w-full items-center justify-around md:flex-col md:items-stretch md:gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.label)}
                    className={`${item.inProfileMenu ? "hidden md:flex" : "flex"} nav-item nav-link`}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon size={21} strokeWidth={active ? 2.35 : 1.8} />
                    <span className="text-xs md:hidden lg:inline lg:text-sm">{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => profileMenuRef.current?.showModal()}
                aria-label="Open profile navigation"
                aria-haspopup="dialog"
                data-active={
                  activePage === "Account" ||
                  navItems.some((item) => item.label === activePage && item.inProfileMenu)
                }
                className="nav-item nav-link flex md:hidden"
              >
                <span className="grid h-[21px] w-[21px] place-items-center rounded-full bg-gold text-xs font-bold text-navy">
                  AM
                </span>
                <span className="text-xs">You</span>
              </button>
            </nav>
            <button
              onClick={openCreatePost}
              aria-label="Create post"
              className="mt-5 hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-bold text-white hover:bg-accent-hover md:flex"
            >
              <PenLine size={18} />
              <span className="hidden lg:inline">Create post</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("Account")}
              aria-label="Account"
              aria-current={activePage === "Account" ? "page" : undefined}
              className="mt-4 hidden min-h-11 shrink-0 border-t border-line items-center justify-center gap-3 rounded-lg px-3 text-sm font-semibold nav-link md:flex lg:justify-start"
            >
              <KeyRound size={19} />
              <span className="hidden lg:inline">Account</span>
            </button>
          </div>
        </aside>
        <main className="community-main">
          <div
            role="status"
            className={
              status
                ? "border-b border-line bg-soft px-4 py-3 text-sm text-muted sm:px-6"
                : "sr-only"
            }
          >
            {status}
          </div>
          {menuTarget && (
            <OptionsMenu
              target={menuTarget}
              onClose={() => setMenuTarget(null)}
              onDeleteRequest={setDeleteTarget}
              flash={flash}
            />
          )}
          {deleteTarget && (
            <DeleteConfirmation
              onCancel={() => setDeleteTarget(null)}
              onConfirm={() => {
                if (deleteTarget.contentId !== undefined) {
                  setPosts((current) =>
                    current.filter((post) => post.id !== deleteTarget.contentId),
                  );
                  if (selectedPost?.id === deleteTarget.contentId) setSelectedPost(null);
                }
                setDeleteTarget(null);
                flash("Post deleted");
              }}
            />
          )}
          {creatingPost && (
            <CreatePost
              avatar={<Avatar text="AM" tone="bg-[#F0C966] text-[#493407]" size="lg" />}
              draft={draft}
              onDraftChange={setDraft}
              onPublish={publish}
              onCancel={() => setCreatingPost(false)}
            />
          )}
          {selectedPost ? (
            <PostDetailPage
              post={posts.find((post) => post.id === selectedPost.id) ?? selectedPost}
              onBack={() => {
                setSelectedPost(null);
                setMenuTarget(null);
                setDeleteTarget(null);
              }}
              onLike={toggleLike}
              onBookmark={toggleBookmark}
              onMenu={setMenuTarget}
              flash={flash}
            />
          ) : viewedProfile ? (
            <OtherProfilePage
              profile={viewedProfile}
              onBack={() => setViewedProfile(null)}
              navigate={navigate}
              flash={flash}
            />
          ) : (
            pageContent[activePage]
          )}
        </main>
        <RightRail navigate={navigate} />
      </div>
      <dialog
        ref={profileMenuRef}
        aria-labelledby="mobile-profile-navigation-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="mobile-profile-drawer fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-none w-[min(20rem,85vw)] max-w-none overflow-y-auto border-r border-line bg-white text-ink backdrop:bg-ink/45"
      >
        <div className="min-h-full p-4">
          <div className="-mx-4 -mt-4 flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-5 text-ink">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar text="AM" tone="bg-[#F0C966] text-[#493407]" size="md" />
              <h2 id="mobile-profile-navigation-title" className="truncate font-bold">
                Alex Morgan
              </h2>
            </div>
            <button
              type="button"
              onClick={() => profileMenuRef.current?.close()}
              aria-label="Close profile navigation"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-muted hover:bg-soft"
            >
              <X size={20} />
            </button>
          </div>
          <nav aria-label="Profile navigation" className="mt-3 grid gap-1">
            {navItems
              .filter((item) => item.inProfileMenu)
              .map(({ label, icon: Icon, badge }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    profileMenuRef.current?.close();
                    navigate(label);
                  }}
                  aria-current={activePage === label ? "page" : undefined}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold nav-link"
                >
                  <Icon size={20} />
                  {label}
                  {badge && (
                    <span className="ml-auto rounded-lg bg-danger px-2 py-0.5 text-xs text-white">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            <button
              type="button"
              onClick={() => {
                profileMenuRef.current?.close();
                navigate("Account");
              }}
              aria-current={activePage === "Account" ? "page" : undefined}
              className="nav-link mt-2 flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold"
            >
              <KeyRound size={20} />
              Account
            </button>
          </nav>
        </div>
      </dialog>
      <button
        onClick={openCreatePost}
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-30 grid h-14 w-14 place-items-center rounded-xl bg-accent text-white shadow-md md:hidden"
        aria-label="Create post"
      >
        <PenLine size={22} />
      </button>
    </div>
  );
}
