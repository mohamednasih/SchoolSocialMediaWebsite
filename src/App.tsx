import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BellOff,
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
  MoreHorizontal,
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

type Page =
  | "Home"
  | "Explore"
  | "Friends"
  | "Notifications"
  | "Messages"
  | "Profile"
  | "Settings"
  | "Search";

type SettingsView = "overview" | "profile" | "avatar" | "email" | "password" | "sessions";

type AccountProfile = {
  name: string;
  bio: string;
  photo: File | null;
};

const initialProfile: AccountProfile = {
  name: "Alex Morgan",
  bio: "Music, science and reading.",
  photo: null,
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function postAuthor(profile: AccountProfile) {
  return { name: profile.name, avatar: initials(profile.name), photo: profile.photo };
}

type Post = {
  id: number;
  name: string;
  handle: string;
  time: string;
  avatar: string;
  avatarTone: string;
  photo?: File | null;
  audience?: string;
  text: string;
  tag?: string;
  replies: number;
  likes: number;
  liked?: boolean;
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
    avatarTone: "bg-[#123B72] text-white",
    audience: "School announcement",
    text: "We’ve published a new guide to respectful conversations online. Please take a moment to read it and help keep Westbridge Connect welcoming for everyone.",
    tag: "CommunityGuidelines",
    replies: 12,
    likes: 86,
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

const navItems: { label: Page; icon: typeof Home; badge?: number; mobilePrimary?: boolean }[] = [
  { label: "Home", icon: Home, mobilePrimary: true },
  { label: "Explore", icon: Search, mobilePrimary: true },
  { label: "Friends", icon: Users, badge: 2 },
  { label: "Notifications", icon: Bell, badge: 2, mobilePrimary: true },
  { label: "Messages", icon: Mail, badge: 2, mobilePrimary: true },
  { label: "Profile", icon: CircleUserRound },
  { label: "Settings", icon: Settings },
];
const moreNavItems = navItems.filter((item) => !item.mobilePrimary);

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

const friends: UserProfile[] = [
  ...onlineFriends.map((friend) => ({ ...friend, online: true })),
  ...people.slice(0, 2).map((person) => ({ ...person, online: false })),
].filter((friend, index, all) => all.findIndex((other) => other.handle === friend.handle) === index);

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

type AvatarSize = "sm" | "md" | "lg" | "xl";

function Avatar({
  text,
  tone,
  photo,
  size = "md",
}: {
  text: string;
  tone: string;
  photo?: File | null;
  size?: AvatarSize;
}) {
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!image.current || !photo) return;
    const url = URL.createObjectURL(photo);
    image.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  const sizes = {
    sm: "h-9 w-9 text-[11px]",
    md: "h-11 w-11 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-24 w-24 text-2xl",
  };
  if (photo) {
    return (
      <img
        ref={image}
        alt=""
        className={`${sizes[size]} shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} ${tone} flex shrink-0 items-center justify-center rounded-full font-bold tracking-tight shadow-sm ring-2 ring-white`}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}

function ProfileAvatar({ profile, size }: { profile: AccountProfile; size: AvatarSize }) {
  return (
    <Avatar
      text={initials(profile.name)}
      photo={profile.photo}
      tone="bg-[#F0C966] text-[#493407]"
      size={size}
    />
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
    <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between border-b border-[#DCE3EE] bg-white/90 px-4 backdrop-blur-xl sm:px-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-[-0.03em]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs font-medium text-[#7A899D]">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#516176] hover:bg-[#EEF3F8] focus-visible:outline-[#1E63B5]"
    >
      <Settings size={18} aria-hidden="true" />
      Settings
    </button>
  );
}

function PostCard({
  post,
  onLike,
  onOpen,
  onMenu,
  flash,
}: {
  post: Post;
  onLike: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  return (
    <article
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest("button")) onOpen(post);
      }}
      className="cursor-pointer border-b border-[#DCE3EE] px-4 py-5 transition hover:bg-[#FBFCFE] sm:px-6"
    >
      <div className="flex gap-3">
        <Avatar text={post.avatar} tone={post.avatarTone} photo={post.photo} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <p className="truncate text-[15px] font-extrabold">{post.name}</p>
                <span className="shrink-0 text-sm text-[#9AA5B3]">·</span>
                <span className="shrink-0 text-sm text-[#7B899B]">{post.time}</span>
              </div>
              {post.audience && (
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#2871BF]">
                  {post.audience}
                </p>
              )}
            </div>
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
                className="-mr-2 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#8190A3] transition hover:bg-[#EAF2FC] hover:text-[#1E63B5]"
                aria-label="More options"
              >
                <Ellipsis size={19} />
              </button>
            )}
          </div>
          <button
            onClick={() => onOpen(post)}
            className="mt-2 block w-full text-left text-[15px] leading-[1.55] text-[#263750]"
          >
            {post.text}{" "}
            {post.tag && <span className="font-semibold text-[#2168B4]">#{post.tag}</span>}
          </button>
          <div className="-ml-2 mt-3 flex max-w-[440px] items-center justify-between text-[#718197]">
            <button
              onClick={() => onOpen(post)}
              className="group flex items-center gap-1.5 text-xs font-semibold transition hover:text-[#1E63B5]"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full group-hover:bg-[#EAF2FC]">
                <MessageCircle size={18} />
              </span>
              {post.replies}
            </button>
            <button
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
              onClick={() => flash("Share options")}
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-[#EAF2FC] hover:text-[#1E63B5]"
              aria-label="Share"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function HomePage({
  profile,
  posts,
  draft,
  setDraft,
  publish,
  onLike,
  onOpen,
  onMenu,
  flash,
}: {
  profile: AccountProfile;
  posts: Post[];
  draft: string;
  setDraft: (value: string) => void;
  publish: () => void;
  onLike: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const [tab, setTab] = useState<"For you" | "Friends">("For you");
  return (
    <>
      <PageHeader
        title="Home"
        subtitle="Tuesday, 14 May"
        action={
          <button
            onClick={() => flash("Feed preferences")}
            className="grid h-10 w-10 place-items-center rounded-full text-[#526278] hover:bg-[#EEF3F8]"
            aria-label="Feed preferences"
          >
            <Sparkles size={20} />
          </button>
        }
      />
      <div className="grid grid-cols-2 border-b border-[#DCE3EE] px-4">
        {(["For you", "Friends"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`relative py-4 text-sm font-bold ${
              tab === item ? "text-[#14233C]" : "text-[#8090A3]"
            }`}
          >
            {item}
            {tab === item && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-[#1E63B5]" />
            )}
          </button>
        ))}
      </div>
      <section className="border-b border-[#DCE3EE] px-4 py-5 sm:px-6">
        <div className="flex gap-3">
          <ProfileAvatar profile={profile} size="lg" />
          <div className="min-w-0 flex-1">
            <textarea
              id="composer"
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 280))}
              rows={2}
              className="w-full resize-none bg-transparent pt-2 text-[17px] leading-6 outline-none placeholder:text-[#8A98AA]"
              placeholder="Share something with your school…"
            />
            <div className="mt-3 flex items-center justify-between border-t border-[#EDF0F4] pt-3">
              <p className="text-xs font-medium text-[#8A98AA]">
                Text only · {280 - draft.length} left
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-[#6F8095]">Everyone</span>
                <button
                  onClick={publish}
                  disabled={!draft.trim()}
                  className="rounded-full bg-[#1E63B5] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#164F93] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          onOpen={onOpen}
          onMenu={onMenu}
          flash={flash}
        />
      ))}
    </>
  );
}

function PostDetailPage({
  profile,
  post,
  onBack,
  onLike,
  onMenu,
  flash,
}: {
  profile: AccountProfile;
  post: Post;
  onBack: () => void;
  onLike: (id: number) => void;
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
        name: profile.name,
        handle: "@alexm",
        time: "now",
        initials: initials(profile.name),
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
      <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-[#DCE3EE] bg-white/90 px-3 backdrop-blur-xl sm:px-5">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full text-[#5E6E83] hover:bg-[#EEF3F8]"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold tracking-[-0.03em]">Post</h1>
          <p className="text-xs text-[#7B899B]">{comments.length} comments</p>
        </div>
      </header>

      <PostCard
        post={post}
        onLike={onLike}
        onOpen={() => undefined}
        onMenu={onMenu}
        flash={flash}
      />

      <section className="border-b border-[#DCE3EE] px-4 py-4 sm:px-6">
        <div className="flex gap-3">
          <ProfileAvatar profile={profile} size="md" />
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs text-[#7B899B]">
              Commenting on <span className="font-semibold text-[#1E63B5]">{post.name}’s post</span>
            </p>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value.slice(0, 280))}
              rows={2}
              placeholder="Write a comment…"
              className="w-full resize-none bg-transparent text-[15px] leading-6 outline-none placeholder:text-[#94A0AF]"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#8A98AA]">
                Text only · {280 - reply.length} left
              </span>
              <button
                onClick={addComment}
                disabled={!reply.trim()}
                className="rounded-full bg-[#1E63B5] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
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
          const own = comment.handle === "@alexm";
          const author = own ? profile.name : comment.name;
          return (
            <article
              key={comment.id}
              className="border-b border-[#E1E7EF] px-4 py-5 hover:bg-[#FBFCFE] sm:px-6"
            >
              <div className="flex gap-3">
                <div className="relative">
                  {own ? (
                    <ProfileAvatar profile={profile} size="md" />
                  ) : (
                    <Avatar text={comment.initials} tone={comment.tone} size="md" />
                  )}
                  <span className="absolute left-1/2 top-12 h-[calc(100%+6px)] w-px -translate-x-1/2 bg-[#E0E6EE]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <p className="truncate text-sm font-extrabold">{author}</p>
                      <span className="text-xs text-[#A0AAB7]">·</span>
                      <span className="shrink-0 text-xs text-[#7B899B]">{comment.time}</span>
                    </div>
                    <button
                      onClick={() =>
                        onMenu({
                          name: author,
                          handle: comment.handle,
                          kind: "comment",
                        })
                      }
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#8290A2] hover:bg-[#EAF2FC] hover:text-[#1E63B5]"
                      aria-label="Comment options"
                    >
                      <Ellipsis size={18} />
                    </button>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-[#33445C]">{comment.text}</p>
                  <div className="-ml-2 mt-2 flex items-center text-[#718197]">
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

function SearchField({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
}) {
  const [suggesting, setSuggesting] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const suggestion = useRef<HTMLButtonElement>(null);
  const term = value.trim();

  return (
    <form
      role="search"
      className="relative min-w-0 flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        if (term) {
          setSuggesting(false);
          onSearch(term);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setSuggesting(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && suggesting) {
          event.preventDefault();
          input.current?.focus();
          setSuggesting(false);
        }
      }}
    >
      <div className="flex h-[52px] items-center gap-2 rounded-full border border-[#CDD9E3] bg-white pl-4 pr-2 focus-within:border-[#99AFBF]">
        <Search size={18} aria-hidden="true" className="shrink-0 text-[#536471]" />
        <input
          ref={input}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setSuggesting(true);
          }}
          onFocus={() => setSuggesting(true)}
          onClick={() => setSuggesting(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && suggestion.current) {
              event.preventDefault();
              suggestion.current.focus();
            }
          }}
          autoComplete="off"
          enterKeyHint="search"
          aria-label="Search Westbridge"
          placeholder="Search Westbridge"
          className="h-full min-w-0 flex-1 bg-transparent text-base text-[#0F1419] outline-none placeholder:text-[#66768A]"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              input.current?.focus();
            }}
            className="grid size-10 shrink-0 place-items-center rounded-full"
          >
            <span className="grid size-[22px] place-items-center rounded-full bg-[#0F1419] text-white">
              <X size={12} strokeWidth={3} />
            </span>
          </button>
        )}
      </div>
      {suggesting && term && (
        <div className="absolute inset-x-0 top-full z-40 overflow-hidden rounded-lg border border-[#E1E7EB] bg-white shadow-[0_3px_14px_rgba(15,20,25,0.14)]">
          <button
            ref={suggestion}
            type="submit"
            onMouseDown={(event) => event.preventDefault()}
            className="block min-h-16 w-full break-words px-5 py-4 text-left text-base text-[#0F1419] hover:bg-[#F7F9FA] focus-visible:bg-[#EFF3F8]"
          >
            Search for "{term}"
          </button>
        </div>
      )}
    </form>
  );
}

function ExplorePage({
  onSearch,
  flash,
}: {
  onSearch: (query: string) => void;
  flash: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <>
      <PageHeader title="Explore" subtitle="Discover what’s happening at Westbridge" />
      <div className="border-b border-[#DCE3EE] p-4 sm:p-5">
        <SearchField value={query} onChange={setQuery} onSearch={onSearch} />
      </div>
      <section className="border-b border-[#DCE3EE] py-4">
        <h2 className="px-4 text-lg font-extrabold sm:px-6">Trending now</h2>
        {trends.map((trend, index) => (
          <button
            key={trend.title}
            onClick={() => flash(`#${trend.title.replace(" ", "")} preview`)}
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-[#F6F8FB] sm:px-6"
          >
            <span className="w-5 text-center text-xs font-bold text-[#A0AAB7]">{index + 1}</span>
            <div className="flex-1">
              <p className="text-sm font-extrabold">#{trend.title}</p>
              <p className="text-[11px] text-[#8996A8]">{trend.posts}</p>
            </div>
            <ChevronRight size={18} className="text-[#9AA6B5]" />
          </button>
        ))}
      </section>
    </>
  );
}

function FriendsPage({
  onViewProfile,
  onOpenSettings,
  flash,
}: {
  onViewProfile: (profile: UserProfile) => void;
  onOpenSettings: () => void;
  flash: (message: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"Friends" | "Requests" | "Sent">("Friends");
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

  const respond = (name: string, accepted: boolean) => {
    setRequests((current) => current.filter((request) => request.name !== name));
    flash(accepted ? `${name} is now your friend` : "Friend request removed");
  };

  return (
    <>
      <PageHeader
        title="Friends"
        subtitle="126 friends"
        action={<SettingsButton onClick={onOpenSettings} />}
      />
      <div className="grid grid-cols-3 border-b border-[#DCE3EE] bg-white px-2 sm:px-4">
        {[
          { label: "Friends" as const, count: 126 },
          { label: "Requests" as const, count: requests.length },
          { label: "Sent" as const, count: sentRequests.length },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`relative flex items-center justify-center gap-1.5 py-4 text-xs font-bold sm:text-sm ${
              activeTab === item.label ? "text-[#14233C]" : "text-[#8090A3]"
            }`}
          >
            {item.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] ${
                activeTab === item.label
                  ? "bg-[#EAF2FC] text-[#1E63B5]"
                  : "bg-[#F0F3F7] text-[#7B899B]"
              }`}
            >
              {item.count}
            </span>
            {activeTab === item.label && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[#1E63B5]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Requests" && (
        <section className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Friend requests</h2>
            {requests.length > 0 && (
              <span className="rounded-full bg-[#EAF2FC] px-2.5 py-1 text-xs font-bold text-[#1E63B5]">
                {requests.length} new
              </span>
            )}
          </div>
          {requests.length ? (
            <div className="mt-3 space-y-2">
              {requests.map((request) => (
                <div
                  key={request.name}
                  className="flex items-center gap-3 rounded-2xl border border-[#E0E6EE] p-3 sm:p-4"
                >
                  <Avatar text={request.initials} tone={request.tone} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">{request.name}</p>
                    <p className="mt-1 text-[11px] text-[#1E63B5]">{request.mutual}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => respond(request.name, false)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-[#D6DEE8] text-[#718097] hover:bg-[#F1F4F8]"
                      aria-label={`Decline ${request.name}'s friend request`}
                    >
                      <UserX size={17} />
                    </button>
                    <button
                      onClick={() => respond(request.name, true)}
                      className="flex h-9 items-center gap-1.5 rounded-full bg-[#1E63B5] px-3.5 text-xs font-bold text-white hover:bg-[#174F91]"
                    >
                      <UserCheck size={16} /> Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-[#F4F7FA] px-4 py-7 text-center">
              <UserCheck className="mx-auto text-[#2A8A65]" size={24} />
              <p className="mt-2 text-sm font-bold">You’re all caught up</p>
              <p className="mt-1 text-xs text-[#7B899B]">No new friend requests</p>
            </div>
          )}
        </section>
      )}

      {activeTab === "Sent" && (
        <section className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold">Sent requests</h2>
              <p className="mt-0.5 text-xs text-[#7B899B]">People you’re waiting to hear from</p>
            </div>
            {sentRequests.length > 0 && (
              <span className="rounded-full bg-[#F1F4F8] px-2.5 py-1 text-xs font-bold text-[#66768A]">
                {sentRequests.length} pending
              </span>
            )}
          </div>
          {sentRequests.length ? (
            <div className="mt-3 space-y-2">
              {sentRequests.map((request) => (
                <div
                  key={request.handle}
                  className="flex items-center gap-3 rounded-2xl border border-[#E0E6EE] p-3 sm:p-4"
                >
                  <Avatar text={request.initials} tone={request.tone} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">{request.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-[#8290A2]">
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
                    className="rounded-full border border-[#C8D1DC] px-3.5 py-2 text-xs font-bold text-[#53647A] hover:bg-[#F3F6F9]"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-[#F4F7FA] px-4 py-7 text-center">
              <UserPlus className="mx-auto text-[#718197]" size={24} />
              <p className="mt-2 text-sm font-bold">No pending requests</p>
              <p className="mt-1 text-xs text-[#7B899B]">Requests you send will appear here</p>
            </div>
          )}
        </section>
      )}

      {activeTab === "Friends" && (
        <section className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">All friends</h2>
            <button className="grid h-9 w-9 place-items-center rounded-full text-[#718097] hover:bg-[#EEF3F8]">
              <Search size={18} />
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {friends.map((friend) => (
              <button
                key={friend.handle}
                onClick={() => onViewProfile(friend)}
                className="flex items-center gap-3 rounded-xl border border-[#E3E8EF] p-3 text-left hover:bg-[#F8FAFC]"
              >
                <div className="relative">
                  <Avatar text={friend.initials} tone={friend.tone} size="md" />
                  {friend.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#2AAF72]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{friend.name}</p>
                  <p className="truncate text-[11px] text-[#7B899B]">
                    {friend.status ?? "12 mutual friends"}
                  </p>
                </div>
                <ChevronRight size={16} className="text-[#9AA6B5]" />
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function NotificationsPage({ onOpenSettings }: { onOpenSettings: () => void }) {
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
      tone: "bg-[#123B72] text-white",
      text: "Westbridge School published an update to the community guidelines.",
      time: "5h",
    },
  ];
  return (
    <>
      <PageHeader
        title="Notifications"
        action={<SettingsButton onClick={onOpenSettings} />}
      />
      <div>
        {notifications.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex w-full gap-3 border-b border-[#E2E7EE] px-4 py-5 text-left sm:px-6"
            >
              <span
                className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full ${item.color}`}
              >
                <Icon size={18} fill={item.icon === Heart ? "currentColor" : "none"} />
              </span>
              <div className="min-w-0 flex-1">
                <Avatar text={item.avatar} tone={item.tone} size="sm" />
                <p className="mt-2 text-sm leading-5 text-[#33445C]">
                  <span className="font-semibold">{item.text}</span>{" "}
                  <span className="text-[#8A97A8]">· {item.time}</span>
                </p>
                {item.note && (
                  <p className="mt-2 rounded-xl border border-[#E0E6EE] p-3 text-sm text-[#68778A]">
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
    <div className="flex min-h-[calc(100vh-72px)] flex-col">
      <div className={`${activeChat !== null ? "hidden sm:flex" : "flex"} flex-col sm:flex`}>
        <PageHeader
          title="Messages"
          action={
            <button
              onClick={() => flash("New message")}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#EAF2FC] text-[#1E63B5]"
              aria-label="New message"
            >
              <PenLine size={19} />
            </button>
          }
        />
        <div className="border-b border-[#DCE3EE] p-4">
          <label className="flex items-center gap-3 rounded-xl bg-[#EFF3F8] px-4 py-3">
            <Search size={17} className="text-[#718097]" />
            <input
              value={conversationQuery}
              onChange={(event) => setConversationQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              placeholder="Search conversations"
            />
            {conversationQuery && (
              <button
                onClick={() => setConversationQuery("")}
                className="grid h-6 w-6 place-items-center rounded-full text-[#718097] hover:bg-[#E0E7EE]"
                aria-label="Clear conversation search"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>
      </div>
      <div className="min-h-0 flex-1 sm:grid sm:grid-cols-[260px_minmax(0,1fr)]">
        <div
          className={`border-r border-[#DCE3EE] ${
            activeChat !== null ? "hidden sm:block" : "block"
          }`}
        >
          {filteredConversations.map(({ conversation: chat, index }) => (
            <button
              key={chat.name}
              onClick={() => setActiveChat(index)}
              className={`flex w-full items-center gap-3 border-b border-[#E8ECF2] px-4 py-4 text-left transition hover:bg-[#F4F7FA] ${
                activeChat === index ? "bg-[#EDF4FC]" : ""
              }`}
            >
              <div className="relative">
                <Avatar text={chat.initials} tone={chat.tone} size="lg" />
                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-[#2AAF72]" />
                )}
                {chat.unread && (
                  <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-[#1E63B5]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate text-sm ${chat.unread ? "font-extrabold" : "font-bold"}`}>
                    {chat.name}
                  </p>
                  <span className="text-[10px] text-[#8A97A8]">{chat.time}</span>
                </div>
                <p
                  className={`mt-1 truncate text-xs ${
                    chat.unread ? "font-semibold text-[#46576D]" : "text-[#7D8B9C]"
                  }`}
                >
                  {chat.preview}
                </p>
              </div>
            </button>
          ))}
          {filteredConversations.length === 0 && (
            <div className="px-5 py-14 text-center">
              <Search size={24} className="mx-auto text-[#A0AAB7]" />
              <p className="mt-3 text-sm font-bold">No conversations found</p>
              <p className="mt-1 text-xs text-[#7B899B]">Try another friend or group name.</p>
            </div>
          )}
        </div>
        <div
          className={`${activeChat === null ? "hidden sm:flex" : "flex"} min-h-[560px] flex-col`}
        >
          <div className="flex h-[68px] items-center gap-3 border-b border-[#DCE3EE] px-4">
            <button
              onClick={() => setActiveChat(null)}
              className="grid h-9 w-9 place-items-center rounded-full text-[#66758A] hover:bg-[#EEF3F8] sm:hidden"
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
              <p className="truncate text-sm font-extrabold">{selected.name}</p>
              <p className={`text-[11px] ${selected.online ? "text-[#208A60]" : "text-[#728196]"}`}>
                {selected.online ? "Active now" : "Offline"}
              </p>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full text-[#718097] hover:bg-[#EEF3F8]">
              <Ellipsis size={19} />
            </button>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-3 bg-[#FAFBFD] p-4 sm:p-5">
            <p className="mb-3 text-center text-[11px] text-[#95A0AF]">Today, 10:36am</p>
            <div className="max-w-[82%] self-start rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-5 text-[#33445C] shadow-sm ring-1 ring-[#E2E7EE]">
              Hi Alex! Did you understand question four in the science homework?
            </div>
            <div className="max-w-[82%] self-end rounded-2xl rounded-br-sm bg-[#1E63B5] px-4 py-3 text-sm leading-5 text-white">
              I think so. I used the example from today’s lesson.
            </div>
            <div className="max-w-[82%] self-start rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-5 text-[#33445C] shadow-sm ring-1 ring-[#E2E7EE]">
              That makes sense now, thank you!
            </div>
            {sentMessages.map((sentMessage) => (
              <div key={sentMessage.id} className="flex max-w-[86%] flex-col items-end self-end">
                <div className="rounded-2xl rounded-br-sm bg-[#1E63B5] px-4 py-3 text-sm leading-5 text-white">
                  {sentMessage.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#DCE3EE] bg-white p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={1}
                placeholder="Write a message…"
                className="min-h-10 flex-1 resize-none rounded-2xl bg-[#F0F4F8] px-4 py-2.5 text-sm outline-none"
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
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1E63B5] text-white disabled:opacity-40"
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

function ProfilePage({
  profile,
  posts,
  navigate,
  onEditProfile,
  onLike,
  onOpen,
  onMenu,
  flash,
}: {
  profile: AccountProfile;
  posts: Post[];
  navigate: (page: Page) => void;
  onEditProfile: () => void;
  onLike: (id: number) => void;
  onOpen: (post: Post) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const [tab, setTab] = useState("Posts");
  const ownPosts = posts.filter((post) => post.handle === "@alexm");
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
        title={profile.name}
        subtitle={`${ownPosts.length || 12} posts`}
        action={<SettingsButton onClick={() => navigate("Settings")} />}
      />
      <div className="px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
        <div className="flex items-end justify-between gap-3">
          <ProfileAvatar profile={profile} size="xl" />
          <button
            type="button"
            onClick={onEditProfile}
            className="mb-1 min-h-11 rounded-full border border-[#BFC9D6] bg-white px-4 text-sm font-bold hover:bg-[#F5F7FA] focus-visible:outline-[#1E63B5]"
          >
            Edit profile
          </button>
        </div>
        <h2 className="mt-3 text-xl font-extrabold">{profile.name}</h2>
        <p className="mt-4 text-sm leading-6 text-[#33445C]">{profile.bio}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#728196]">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} /> Westbridge School
          </span>
        </div>
        <div className="mt-4 flex gap-5 text-sm">
          <button onClick={() => navigate("Friends")}>
            <strong>126</strong> <span className="text-[#7C899B]">Friends</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 border-b border-[#DCE3EE]">
        {["Posts", "Replies", "Likes"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`relative py-4 text-sm font-bold ${
              tab === item ? "text-[#14233C]" : "text-[#8090A3]"
            }`}
          >
            {item}
            {tab === item && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[#1E63B5]" />
            )}
          </button>
        ))}
      </div>
      {tab === "Posts" &&
        (ownPosts.length ? (
          ownPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={onLike}
              onOpen={onOpen}
              onMenu={onMenu}
              flash={flash}
            />
          ))
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="font-bold">Your posts will appear here</p>
            <p className="mt-1 text-sm text-[#7B899B]">Share an update from the Home page.</p>
          </div>
        ))}

      {tab === "Replies" && (
        <div>
          {ownReplies.map((item) => {
            const originalPost = posts.find((post) => post.id === item.postId);
            return (
              <article key={item.id} className="border-b border-[#E1E7EF] px-4 py-5 sm:px-6">
                <div className="flex gap-3">
                  <ProfileAvatar profile={profile} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <p className="truncate text-sm font-extrabold">{profile.name}</p>
                          <span className="text-xs text-[#A0AAB7]">·</span>
                          <span className="shrink-0 text-xs text-[#7B899B]">{item.time}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#7B899B]">
                          Commented on{" "}
                          <button
                            onClick={() => originalPost && onOpen(originalPost)}
                            className="font-semibold text-[#1E63B5] hover:underline"
                          >
                            {item.target}’s post
                          </button>
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          onMenu({
                            name: profile.name,
                            handle: "@alexm",
                            kind: "comment",
                          })
                        }
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#8290A2] hover:bg-[#EAF2FC] hover:text-[#1E63B5]"
                        aria-label="Comment options"
                      >
                        <Ellipsis size={18} />
                      </button>
                    </div>
                    <p className="mt-2 text-[15px] leading-6 text-[#33445C]">{item.text}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[#718197]">
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

type ProfileDetails = Omit<AccountProfile, "photo">;

function AvatarEditor({
  profile,
  onSave,
  onCancel,
  flash,
}: {
  profile: AccountProfile;
  onSave: (photo: File | null) => void;
  onCancel: () => void;
  flash: (message: string) => void;
}) {
  const [photo, setPhoto] = useState(profile.photo);

  return (
    <form
      aria-label="Edit avatar"
      className="space-y-5 rounded-2xl border border-[#DFE5ED] bg-white p-5 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (photo !== profile.photo) onSave(photo);
      }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <ProfileAvatar profile={{ ...profile, photo }} size="xl" />
        <div>
          <label className="inline-block cursor-pointer rounded-xl bg-[#1E63B5] px-4 py-2 text-sm font-bold text-white focus-within:ring-2 focus-within:ring-[#1E63B5] focus-within:ring-offset-2 hover:bg-[#174F91]">
            {photo ? "Change image" : "Choose image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  flash("Avatar must be 5 MB or smaller");
                  return;
                }
                if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                  flash("Choose a JPG, PNG or WebP image");
                  return;
                }
                setPhoto(file);
              }}
            />
          </label>
          {photo && (
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="ml-2 rounded-xl px-3 py-2 text-sm font-bold text-[#C84747] hover:bg-[#FFF4F4]"
            >
              Remove avatar
            </button>
          )}
          <p className="mt-2 text-xs text-[#66768A]">JPG, PNG or WebP, up to 5 MB.</p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#D3DBE5] px-4 py-2.5 text-sm font-bold text-[#53647A] hover:bg-[#F4F7FA]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={photo === profile.photo}
          className="rounded-xl bg-[#1E63B5] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#174F91] disabled:opacity-40"
        >
          Save avatar
        </button>
      </div>
    </form>
  );
}

function ProfileDetailsForm({
  profile: { name, bio },
  onSave,
  onCancel,
}: {
  profile: ProfileDetails;
  onSave: (details: ProfileDetails) => void;
  onCancel: () => void;
}) {
  const [editDraft, setEditDraft] = useState({ name, bio });

  return (
    <form
      aria-label="Profile details"
      onSubmit={(event) => {
        event.preventDefault();
        const name = editDraft.name.trim();
        if (name) onSave({ ...editDraft, name, bio: editDraft.bio.trim() });
      }}
      className="overflow-hidden rounded-2xl border border-[#DFE5ED] bg-white"
    >
      <div className="p-5 sm:p-6">
        <label className="block">
          <span className="text-xs font-bold text-[#526278]">Display name</span>
          <input
            value={editDraft.name}
            onChange={(event) =>
              setEditDraft((current) => ({
                ...current,
                name: event.target.value.slice(0, 40),
              }))
            }
            required
            className="mt-2 w-full rounded-xl border border-[#CCD5E0] px-4 py-3 text-sm outline-none transition focus:border-[#1E63B5] focus:ring-2 focus:ring-[#D8E8F8]"
            placeholder="Your name"
          />
          <span className="mt-1.5 block text-right text-[11px] text-[#8B98A9]">
            {editDraft.name.length}/40
          </span>
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-bold text-[#526278]">Bio</span>
          <textarea
            value={editDraft.bio}
            onChange={(event) =>
              setEditDraft((current) => ({
                ...current,
                bio: event.target.value.slice(0, 120),
              }))
            }
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-[#CCD5E0] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1E63B5] focus:ring-2 focus:ring-[#D8E8F8]"
            placeholder="Tell your friends a little about yourself"
          />
          <span className="mt-1.5 block text-right text-[11px] text-[#8B98A9]">
            {editDraft.bio.length}/120
          </span>
        </label>

      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-[#E1E7EE] bg-white p-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#D3DBE5] px-5 py-3 text-sm font-bold text-[#53647A] hover:bg-[#F4F7FA]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!editDraft.name.trim()}
          className="rounded-xl bg-[#1E63B5] px-5 py-3 text-sm font-bold text-white hover:bg-[#174F91] disabled:opacity-40"
        >
          Save profile details
        </button>
      </div>
    </form>
  );
}

function SettingsPage({
  view,
  setView,
  profile,
  onSaveProfile,
  onLogOut,
  onBack,
  flash,
}: {
  view: SettingsView;
  setView: (view: SettingsView) => void;
  profile: AccountProfile;
  onSaveProfile: (profile: AccountProfile) => void;
  onLogOut: () => void;
  onBack: () => void;
  flash: (message: string) => void;
}) {
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
  const titles: Record<SettingsView, string> = {
    overview: "Settings",
    profile: "Update profile",
    avatar: "Edit avatar",
    email: "Email address",
    password: "Change password",
    sessions: "Active sessions",
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-[#DCE3EE] bg-white/90 px-3 backdrop-blur-xl sm:px-5">
        <button
          autoFocus
          onClick={() => {
            if (view === "avatar") {
              setView("profile");
            } else if (view !== "overview") {
              setView("overview");
            } else {
              onBack();
            }
          }}
          className="grid h-11 w-11 place-items-center rounded-full text-[#5E6E83] hover:bg-[#EEF3F8]"
          aria-label={view === "avatar" ? "Back to update profile" : view === "overview" ? "Back to previous page" : "Back to settings"}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold tracking-[-0.03em]">
            {titles[view]}
          </h1>
          <p className="text-xs text-[#7B899B]">
            {view !== "overview" ? "Account settings" : "Account and security"}
          </p>
        </div>
      </header>

      <div className="space-y-5 bg-[#F8FAFC] p-4 sm:p-6">
        {view === "overview" && (
          <button
            onClick={() => setView("profile")}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#DFE5ED] bg-white p-4 text-left hover:bg-[#F6F8FB] sm:px-5"
          >
            <ProfileAvatar profile={profile} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold">Update profile</span>
              <span className="mt-0.5 block truncate text-xs text-[#7B899B]">{profile.name}</span>
            </span>
            <ChevronRight size={18} className="text-[#8A98A9]" />
          </button>
        )}
        {(view === "profile" || view === "avatar") && (
          <div hidden={view === "avatar"} className="space-y-5">
            <button
              onClick={() => setView("avatar")}
              className="flex w-full items-center gap-3 rounded-2xl border border-[#DFE5ED] bg-white p-4 text-left font-bold hover:bg-[#F6F8FB] sm:px-5"
            >
              <ProfileAvatar profile={profile} size="lg" />
              Edit avatar
              <ChevronRight size={18} className="ml-auto text-[#8A98A9]" />
            </button>
            <ProfileDetailsForm
              profile={profile}
              onCancel={() => setView("overview")}
              onSave={(details) => {
                onSaveProfile({ ...profile, ...details });
                setView("overview");
                flash("Profile updated");
              }}
            />
          </div>
        )}
        {view === "avatar" && (
          <AvatarEditor
            profile={profile}
            onCancel={() => setView("profile")}
            onSave={(photo) => {
              onSaveProfile({ ...profile, photo });
              setView("profile");
              flash("Avatar updated");
            }}
            flash={flash}
          />
        )}
        {(view === "overview" || view === "email") && (
          <section className="overflow-hidden rounded-2xl border border-[#DFE5ED] bg-white">
            <button
              onClick={() => setView(view === "email" ? "overview" : "email")}
              className={`flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5 ${
                view === "email" ? "border-b border-[#E6EAF0]" : ""
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF2FC] text-[#1E63B5]">
                <Mail size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">Email address</h2>
                <p className="mt-0.5 truncate text-xs text-[#7B899B]">{savedEmail}</p>
              </div>
              <ChevronRight
                size={18}
                className={`text-[#8A98A9] transition ${
                  view === "email" ? "rotate-90 text-[#1E63B5]" : ""
                }`}
              />
            </button>
            {view === "email" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setSavedEmail(email.trim());
                  flash("Email address updated");
                }}
                className="p-4 sm:p-5"
              >
                <label className="block">
                  <span className="text-xs font-bold text-[#526278]">School email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#CCD5E0] px-4 py-3 text-sm outline-none transition focus:border-[#1E63B5] focus:ring-2 focus:ring-[#D8E8F8]"
                  />
                </label>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-[#7B899B]">
                    {email === savedEmail ? "Your email is up to date" : "You have unsaved changes"}
                  </p>
                  <button
                    type="submit"
                    disabled={!email.trim() || email === savedEmail}
                    className="rounded-xl bg-[#1E63B5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#174F91] disabled:opacity-40"
                  >
                    Save email
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {(view === "overview" || view === "password") && (
          <section className="overflow-hidden rounded-2xl border border-[#DFE5ED] bg-white">
            <button
              onClick={() => setView(view === "password" ? "overview" : "password")}
              className={`flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5 ${
                view === "password" ? "border-b border-[#E6EAF0]" : ""
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F1ECFA] text-[#7253A3]">
                <KeyRound size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">Change password</h2>
                <p className="mt-0.5 truncate text-xs text-[#7B899B]">
                  Update your account password
                </p>
              </div>
              <ChevronRight
                size={18}
                className={`text-[#8A98A9] transition ${
                  view === "password" ? "rotate-90 text-[#7253A3]" : ""
                }`}
              />
            </button>
            {view === "password" && (
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
                  <span className="text-xs font-bold text-[#526278]">Current password</span>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(event) =>
                      setPasswords((current) => ({ ...current, current: event.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-[#CCD5E0] px-4 py-3 text-sm outline-none focus:border-[#1E63B5] focus:ring-2 focus:ring-[#D8E8F8]"
                    autoComplete="current-password"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold text-[#526278]">New password</span>
                    <input
                      type="password"
                      value={passwords.next}
                      onChange={(event) =>
                        setPasswords((current) => ({ ...current, next: event.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-[#CCD5E0] px-4 py-3 text-sm outline-none focus:border-[#1E63B5] focus:ring-2 focus:ring-[#D8E8F8]"
                      autoComplete="new-password"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-[#526278]">Confirm password</span>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(event) =>
                        setPasswords((current) => ({ ...current, confirm: event.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-[#CCD5E0] px-4 py-3 text-sm outline-none focus:border-[#1E63B5] focus:ring-2 focus:ring-[#D8E8F8]"
                      autoComplete="new-password"
                    />
                  </label>
                </div>
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 text-[11px] text-[#748397]">
                    <ShieldCheck size={15} className="text-[#2A8A65]" />
                    At least 8 characters and both passwords must match
                  </div>
                  <button
                    type="submit"
                    disabled={!passwordValid}
                    className="rounded-xl bg-[#14233C] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#243956] disabled:opacity-40"
                  >
                    Update password
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {(view === "overview" || view === "sessions") && (
          <section className="overflow-hidden rounded-2xl border border-[#DFE5ED] bg-white">
            <button
              onClick={() => setView(view === "sessions" ? "overview" : "sessions")}
              className={`flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5 ${
                view === "sessions" ? "border-b border-[#E6EAF0]" : ""
              }`}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E8F6EF] text-[#23805C]">
                <Laptop size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">Active sessions</h2>
                <p className="mt-0.5 text-xs text-[#7B899B]">
                  {sessions.length} {sessions.length === 1 ? "device" : "devices"} signed in
                </p>
              </div>
              <ChevronRight
                size={18}
                className={`text-[#8A98A9] transition ${
                  view === "sessions" ? "rotate-90 text-[#23805C]" : ""
                }`}
              />
            </button>
            {view === "sessions" && (
              <>
                <div>
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 border-b border-[#EDF0F4] px-4 py-4 last:border-b-0 sm:px-5"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F0F3F7] text-[#68788C]">
                        <Laptop size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-bold">{session.device}</p>
                          {session.current && (
                            <span className="rounded-full bg-[#E8F6EF] px-2 py-0.5 text-[9px] font-bold text-[#23805C]">
                              This device
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-[11px] text-[#7B899B]">
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
                          className="rounded-full border border-[#D2DAE4] px-3 py-2 text-[11px] font-bold text-[#53647A] hover:border-[#E2B9B9] hover:bg-[#FFF4F4] hover:text-[#C84747]"
                        >
                          Log out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {sessions.filter((session) => !session.current).length > 0 && (
                  <div className="border-t border-[#E6EAF0] p-4">
                    <button
                      onClick={() => {
                        setSessions((current) => current.filter((session) => session.current));
                        flash("Other sessions logged out");
                      }}
                      className="w-full rounded-xl border border-[#E3BDBD] py-2.5 text-xs font-bold text-[#C84747] hover:bg-[#FFF4F4]"
                    >
                      Log out all other sessions
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {view === "overview" && (
          <section className="rounded-2xl border border-[#F0CECE] bg-white p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-extrabold">Log out of this account</h2>
                <p className="mt-1 text-xs leading-5 text-[#7B899B]">
                  End your demo session in this tab.
                </p>
              </div>
              <button
                onClick={onLogOut}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C84747] px-4 py-3 text-sm font-bold text-white hover:bg-[#AD3939]"
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
  const [showFriendMenu, setShowFriendMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-[#DCE3EE] bg-white/90 px-3 backdrop-blur-xl sm:px-5">
        <button
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full text-[#5E6E83] hover:bg-[#EEF3F8]"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-extrabold tracking-[-0.03em]">{profile.name}</h1>
          <p className="text-xs text-[#7B899B]">18 posts</p>
        </div>
        <button
          onClick={() => flash("Profile options")}
          className="grid h-10 w-10 place-items-center rounded-full text-[#66758A] hover:bg-[#EEF3F8]"
          aria-label="Profile options"
        >
          <Ellipsis size={20} />
        </button>
      </header>

      <div className="px-4 pb-5 pt-5 sm:px-6 sm:pt-6">
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
              className="grid h-10 w-10 place-items-center rounded-full border border-[#C8D1DC] bg-white text-[#42546A] hover:bg-[#F3F6F9]"
              aria-label={`Message ${profile.name}`}
            >
              <Mail size={18} />
            </button>
            <button
              onClick={() => {
                if (friendship === "friends") setShowFriendMenu(!showFriendMenu);
                if (friendship === "none") {
                  setFriendship("pending");
                  flash(`Friend request sent to ${profile.name}`);
                }
                if (friendship === "pending") {
                  setFriendship("none");
                  flash("Friend request cancelled");
                }
              }}
              className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
                friendship === "friends"
                  ? "border border-[#BFC9D6] bg-white text-[#263750] hover:bg-[#F4F7FA]"
                  : friendship === "pending"
                    ? "border border-[#BFC9D6] bg-white text-[#66768A]"
                    : "bg-[#1E63B5] text-white hover:bg-[#174F91]"
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
            {showFriendMenu && (
              <div className="absolute right-0 top-12 z-20 w-48 overflow-hidden rounded-xl border border-[#DCE3EB] bg-white p-1.5 shadow-xl">
                <button
                  onClick={() => {
                    setShowFriendMenu(false);
                    navigate("Messages");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold hover:bg-[#F3F6F9]"
                >
                  <MessageCircle size={16} /> Send message
                </button>
                <button
                  onClick={() => {
                    setFriendship("none");
                    setShowFriendMenu(false);
                    flash(`${profile.name} was removed from friends`);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-[#C84747] hover:bg-[#FFF0F0]"
                >
                  <UserX size={16} /> Remove friend
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <h2 className="text-xl font-extrabold">{profile.name}</h2>
          {profile.online && (
            <span className="rounded-full bg-[#E8F6EF] px-2 py-1 text-[10px] font-bold text-[#23805C]">
              Online
            </span>
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-[#33445C]">
          Interested in science, books and student voice.
        </p>
        {profile.status && (
          <p className="mt-2 text-xs font-medium text-[#23805C]">{profile.status}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#728196]">
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
          <p className="text-xs text-[#728196]">
            Friends with <strong className="text-[#3D4E64]">Leo, Sofia</strong> and 10 others
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-[#DCE3EE]">
        {["Posts", "About", "Friends"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`relative py-4 text-sm font-bold ${
              tab === item ? "text-[#14233C]" : "text-[#8090A3]"
            }`}
          >
            {item}
            {tab === item && (
              <span className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-[#1E63B5]" />
            )}
          </button>
        ))}
      </div>

      {tab === "Posts" && (
        <div>
          <article className="border-b border-[#E1E7EF] px-4 py-5 sm:px-6">
            <div className="flex gap-3">
              <div className="relative">
                <Avatar text={profile.initials} tone={profile.tone} size="lg" />
                {profile.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#2AAF72]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-extrabold">{profile.name}</p>
                  <span className="text-xs text-[#9AA5B3]">· 32m</span>
                </div>
                <p className="mt-2 text-[15px] leading-6 text-[#33445C]">
                  What revision method works best for you when a topic has lots of new terms?
                </p>
                <div className="mt-3 flex max-w-[280px] items-center justify-between text-xs text-[#718197]">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={16} /> 8
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart size={16} /> 21
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}

      {tab === "About" && (
        <div className="space-y-4 p-4 sm:p-6">
          <section className="rounded-2xl border border-[#E0E6EE] p-4">
            <h3 className="font-extrabold">About {profile.name.split(" ")[0]}</h3>
            <p className="mt-2 text-sm leading-6 text-[#65758A]">
              Student at Westbridge School. This profile is visible to confirmed friends and members
              of the school network.
            </p>
          </section>
          <section className="rounded-2xl border border-[#E0E6EE] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8090A3]">
              Friendship
            </p>
            <p className="mt-2 text-sm font-bold">Friends since September 2023</p>
          </section>
        </div>
      )}

      {tab === "Friends" && (
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-extrabold">Mutual friends</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {onlineFriends.slice(1, 4).map((friend) => (
              <button
                key={friend.name}
                onClick={() => flash(`${friend.name}'s profile`)}
                className="flex items-center gap-3 rounded-xl border border-[#E1E7EE] p-3 text-left hover:bg-[#F7F9FC]"
              >
                <Avatar text={friend.initials} tone={friend.tone} size="md" />
                <div>
                  <p className="text-sm font-bold">{friend.name}</p>
                  <p className="text-[11px] text-[#7B899B]">Mutual friend</p>
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
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#0D1B2A]/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[24px] bg-white p-3 shadow-2xl sm:max-w-[400px] sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#D6DDE6] sm:hidden" />
        <div className="flex items-center justify-between px-2 py-2">
          <div>
            <p className="text-base font-extrabold">
              {target.kind === "post" ? "Post options" : "Comment options"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-[#6F7E91] hover:bg-[#EEF2F6]"
            aria-label="Close options"
          >
            <X size={19} />
          </button>
        </div>
        <div className="my-1 h-px bg-[#E7EBF0]" />
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
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-semibold text-[#C84747] hover:bg-[#FFF0F0]"
          >
            <Trash2 size={19} />
            Delete {target.kind}
          </button>
        ) : (
          <>
            <button
              onClick={() => choose(`You will see fewer posts like this`)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-semibold hover:bg-[#F4F7FA]"
            >
              <BellOff size={19} className="text-[#617187]" />
              Not interested in this
            </button>
          </>
        )}
        <button
          onClick={() => choose("Link copied")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-semibold hover:bg-[#F4F7FA]"
        >
          <Send size={19} className="text-[#617187]" />
          Copy link
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl border border-[#DDE3EB] py-3 text-sm font-bold hover:bg-[#F4F7FA] sm:hidden"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmation({
  target,
  onCancel,
  onConfirm,
}: {
  target: MenuTarget;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0D1B2A]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onClick={onCancel}
    >
      <div
        className="w-full rounded-t-[24px] bg-white p-5 shadow-2xl sm:max-w-[390px] sm:rounded-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-post-title"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D6DDE6] sm:hidden" />
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF0F0] text-[#C84747]">
          <Trash2 size={22} />
        </div>
        <h2 id="delete-post-title" className="mt-4 text-xl font-extrabold tracking-[-0.02em]">
          Delete this post?
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#68778A]">
          This will permanently remove the post, its likes, and all comments. This action cannot be
          undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[#D7DEE7] px-5 py-3 text-sm font-bold text-[#46576D] hover:bg-[#F4F7FA]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-[#C84747] px-5 py-3 text-sm font-bold text-white hover:bg-[#AD3939]"
          >
            Delete post
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchResultsPage({
  posts,
  query,
  submittedQuery,
  onEdit,
  onSearch,
  onBack,
  onOpenPost,
  onOpenProfile,
  onLike,
  onMenu,
  flash,
}: {
  posts: Post[];
  query: string;
  submittedQuery: string;
  onEdit: (value: string) => void;
  onSearch: (query: string) => void;
  onBack: () => void;
  onOpenPost: (post: Post) => void;
  onOpenProfile: (profile: UserProfile) => void;
  onLike: (id: number) => void;
  onMenu: (target: MenuTarget) => void;
  flash: (message: string) => void;
}) {
  const [tab, setTab] = useState<"Posts" | "People">("Posts");
  const searchablePeople = [...onlineFriends, ...people].filter(
    (person, index, all) => all.findIndex((item) => item.name === person.name) === index,
  );
  const peopleResults = submittedQuery
    ? searchablePeople.filter((person) => person.name.toLowerCase().includes(submittedQuery))
    : [];
  const postResults = submittedQuery
    ? posts.filter(
        (post) =>
          post.text.toLowerCase().includes(submittedQuery) ||
          post.name.toLowerCase().includes(submittedQuery) ||
          post.tag?.toLowerCase().includes(submittedQuery.replace("#", "")),
      )
    : [];

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-white">
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#DCE3EE] bg-white/95 px-3 py-3 backdrop-blur-xl sm:px-5">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full text-[#617187] hover:bg-[#EEF3F8]"
            aria-label="Close search"
          >
            <ArrowLeft size={20} />
          </button>
          <SearchField value={query} onChange={onEdit} onSearch={onSearch} />
        </header>
        <div className="grid grid-cols-2 border-b border-[#DCE3EE] px-4">
          {(["Posts", "People"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`relative py-4 text-sm font-bold ${
                tab === item ? "text-[#14233C]" : "text-[#8090A3]"
              }`}
            >
              {item}
              {tab === item && (
                <span className="absolute bottom-0 left-1/2 h-[3px] w-14 -translate-x-1/2 rounded-full bg-[#1E63B5]" />
              )}
            </button>
          ))}
        </div>
        <section
          id="westbridge-search-results"
          aria-label="Search results"
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          {!submittedQuery ? (
            <div className="px-6 py-24 text-center">
              <Search size={30} className="mx-auto text-[#A0AAB7]" />
              <h2 className="mt-4 text-lg font-extrabold">Search {tab.toLowerCase()}</h2>
              <p className="mt-1 text-sm text-[#7B899B]">
                {tab === "Posts"
                  ? "Find posts by words, names, or hashtags."
                  : "Find people by their display name."}
              </p>
            </div>
          ) : tab === "Posts" ? (
            postResults.length ? (
              postResults.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={onLike}
                  onOpen={onOpenPost}
                  onMenu={onMenu}
                  flash={flash}
                />
              ))
            ) : (
              <div className="px-6 py-24 text-center">
                <p className="font-bold">No posts found</p>
                <p className="mt-1 text-sm text-[#7B899B]">Try different words or a hashtag.</p>
              </div>
            )
          ) : peopleResults.length ? (
            <div className="grid gap-2 p-4 sm:grid-cols-2">
              {peopleResults.map((person) => {
                const friend = onlineFriends.find((friend) => friend.handle === person.handle);
                const online = Boolean(friend);
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
                        status: friend?.status,
                      });
                    }}
                    className="flex items-center gap-3 rounded-xl border border-[#E1E7EE] p-3 text-left hover:bg-[#F7F9FC]"
                  >
                    <div className="relative">
                      <Avatar text={person.initials} tone={person.tone} size="md" />
                      {online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#2AAF72]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{person.name}</p>
                      <p className="text-[11px] text-[#7B899B]">
                        {online ? "Online" : "Westbridge School"}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-[#9AA6B5]" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-24 text-center">
              <p className="font-bold">No people found</p>
              <p className="mt-1 text-sm text-[#7B899B]">Try a different display name.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function RightRail({
  navigate,
  onSearch,
}: {
  navigate: (page: Page) => void;
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <aside className="hidden px-6 py-5 xl:block">
      <div className="sticky top-5 space-y-4">
        <SearchField value={query} onChange={setQuery} onSearch={onSearch} />
        <section className="overflow-hidden rounded-2xl border border-[#E0E6EE] bg-white py-3">
          <h2 className="px-5 pb-2 pt-1 text-lg font-extrabold">Popular discussions</h2>
          {trends.slice(0, 3).map((trend) => (
            <button
              key={trend.title}
              onClick={() => navigate("Explore")}
              className="flex w-full items-start justify-between px-5 py-3 text-left hover:bg-[#F6F8FB]"
            >
              <div>
                <p className="text-sm font-extrabold">#{trend.title}</p>
                <p className="text-[11px] text-[#8996A8]">{trend.posts}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => navigate("Explore")}
            className="px-5 py-3 text-sm font-bold text-[#1E63B5]"
          >
            Show more
          </button>
        </section>
        <p className="px-2 text-[11px] leading-5 text-[#8996A8]">
          Community guidelines · Privacy · Accessibility
          <br />© 2025 Westbridge School
        </p>
      </div>
    </aside>
  );
}

function MobileMoreNav({
  currentPage,
  navigate,
}: {
  currentPage: Page;
  navigate: (page: Page) => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const active = open || moreNavItems.some((item) => item.label === currentPage);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, [open]);

  return (
    <div
      ref={container}
      className="flex-1 md:hidden"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-more-navigation"
        onClick={() => setOpen(!open)}
        className={`flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-semibold ${
          active ? "bg-[#EAF2FC] text-[#175CA9]" : "text-[#516176] hover:bg-[#F0F4F9]"
        }`}
      >
        <MoreHorizontal size={22} aria-hidden="true" />
        More
      </button>
      <div
        id="mobile-more-navigation"
        role="group"
        aria-label="More destinations"
        hidden={!open}
        className="absolute bottom-full right-2 mb-2 max-h-[calc(100dvh-5rem)] w-56 overflow-y-auto rounded-2xl border border-[#DCE3EE] bg-white p-1.5 shadow-lg"
      >
        {moreNavItems.map(({ label, icon: Icon, badge }) => (
          <button
            key={label}
            type="button"
            aria-current={currentPage === label ? "page" : undefined}
            onClick={() => {
              trigger.current?.focus();
              setOpen(false);
              navigate(label);
            }}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[#516176] hover:bg-[#F0F4F9] aria-[current=page]:bg-[#EAF2FC] aria-[current=page]:text-[#175CA9]"
          >
            <Icon size={20} aria-hidden="true" />
            {label}
            {badge && (
              <span className="ml-auto rounded-full bg-[#E05454] px-1.5 text-xs text-white">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function SidebarProfile({
  profile,
  onOpenProfile,
  onLogOut,
}: {
  profile: AccountProfile;
  onOpenProfile: () => void;
  onLogOut: () => void;
}) {
  const options = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      const menu = options.current;
      if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);

  return (
    <div className="relative mb-6 mt-auto hidden items-center gap-1 md:flex">
      <button
        type="button"
        onClick={onOpenProfile}
        aria-label={`Open ${profile.name}’s profile`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 text-left hover:bg-[#EEF2F7]"
      >
        <ProfileAvatar profile={profile} size="sm" />
        <span className="hidden truncate text-sm font-bold xl:block">{profile.name}</span>
      </button>
      <details
        ref={options}
        className="hidden xl:block"
        onBlur={(event) => {
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
            event.currentTarget.open = false;
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && event.currentTarget.open) {
            event.preventDefault();
            event.currentTarget.open = false;
            trigger.current?.focus();
          }
        }}
      >
        <summary
          ref={trigger}
          aria-label="Account options"
          title="Account options"
          className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-xl text-[#516176] hover:bg-[#EEF2F7] [&::-webkit-details-marker]:hidden"
        >
          <MoreHorizontal size={20} aria-hidden="true" />
        </summary>
        <div className="absolute inset-x-0 bottom-full mb-2 rounded-xl border border-[#DCE3EE] bg-white p-1.5 shadow-lg">
          <button
            type="button"
            onClick={onLogOut}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold text-[#B33E3E] hover:bg-[#FFF4F4]"
          >
            <LogOut size={18} aria-hidden="true" /> Log out
          </button>
        </div>
      </details>
    </div>
  );
}

const signedOutKey = "westbridge.signedOut";

export default function App() {
  const [signedOut, setSignedOut] = useState(() => {
    try {
      return window.sessionStorage.getItem(signedOutKey) === "1";
    } catch {
      return false;
    }
  });
  const [activePage, setActivePage] = useState<Exclude<Page, "Settings">>("Home");
  const [settingsView, setSettingsView] = useState<SettingsView | null>(null);
  const currentPage = settingsView ? "Settings" : activePage;
  const settingsTrigger = useRef<HTMLElement | null>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [menuTarget, setMenuTarget] = useState<MenuTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuTarget | null>(null);
  const searchOrigin = useRef({ activePage, selectedPost, viewedProfile, settingsView });
  const [search, setSearch] = useState({ draft: "", submitted: "" });

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const navigate = (page: Page, section: SettingsView = "overview") => {
    if (page === "Settings") {
      if (settingsView === null && document.activeElement instanceof HTMLElement) {
        settingsTrigger.current = document.activeElement;
      }
      setSettingsView(section);
    } else {
      setSettingsView(null);
      setSelectedPost(null);
      setViewedProfile(null);
      setActivePage(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeSettings = () => {
    setSettingsView(null);
    requestAnimationFrame(() => settingsTrigger.current?.focus());
  };

  const changeSession = (logOut: boolean) => {
    try {
      if (logOut) window.sessionStorage.setItem(signedOutKey, "1");
      else window.sessionStorage.removeItem(signedOutKey);
    } catch {
      // Embedded previews may disable browser storage.
    }
    setSignedOut(logOut);
    if (logOut) {
      navigate("Home");
      setDraft("");
      setToast("");
      setMenuTarget(null);
      setDeleteTarget(null);
      setSearch({ draft: "", submitted: "" });
    }
  };

  const openSearch = (query: string) => {
    if (activePage !== "Search") {
      searchOrigin.current = { activePage, selectedPost, viewedProfile, settingsView };
    }
    setSearch({ draft: query, submitted: query.toLowerCase() });
    navigate("Search");
    requestAnimationFrame(() => {
      document.getElementById("westbridge-search-results")?.focus({ preventScroll: true });
    });
  };

  const closeSearch = () => {
    const origin = searchOrigin.current;
    navigate(origin.activePage);
    setSelectedPost(origin.selectedPost);
    setViewedProfile(origin.viewedProfile);
    setSettingsView(origin.settingsView);
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveProfile = (updated: AccountProfile) => {
    setProfile(updated);
    const author = postAuthor(updated);
    setPosts((current) =>
      current.map((post) => (post.handle === "@alexm" ? { ...post, ...author } : post)),
    );
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

  const publish = () => {
    if (!draft.trim()) return;
    setPosts((current) => [
      {
        id: Date.now(),
        ...postAuthor(profile),
        handle: "@alexm",
        time: "now",
        avatarTone: "bg-[#F0C966] text-[#493407]",
        text: draft.trim(),
        replies: 0,
        likes: 0,
      },
      ...current,
    ]);
    setDraft("");
    flash("Your post was shared");
  };

  if (signedOut) {
    return (
      <main className="grid min-h-screen place-content-center gap-5 bg-[#F7F9FC] px-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#14233C]">You’re logged out</h1>
        <button
          type="button"
          autoFocus
          onClick={() => changeSession(false)}
          className="min-h-11 rounded-xl bg-[#1E63B5] px-5 text-sm font-bold text-white hover:bg-[#164F93]"
        >
          Open demo account
        </button>
      </main>
    );
  }

  const pageContent = {
    Home: (
      <HomePage
        profile={profile}
        posts={posts}
        draft={draft}
        setDraft={setDraft}
        publish={publish}
        onLike={toggleLike}
        onOpen={openPost}
        onMenu={setMenuTarget}
        flash={flash}
      />
    ),
    Explore: <ExplorePage onSearch={openSearch} flash={flash} />,
    Friends: (
      <FriendsPage
        onViewProfile={setViewedProfile}
        onOpenSettings={() => navigate("Settings")}
        flash={flash}
      />
    ),
    Notifications: <NotificationsPage onOpenSettings={() => navigate("Settings")} />,
    Messages: <MessagesPage flash={flash} />,
    Profile: (
      <ProfilePage
        profile={profile}
        posts={posts}
        navigate={navigate}
        onEditProfile={() => navigate("Settings", "profile")}
        onLike={toggleLike}
        onOpen={openPost}
        onMenu={setMenuTarget}
        flash={flash}
      />
    ),
    Search: (
      <SearchResultsPage
        posts={posts}
        query={search.draft}
        submittedQuery={search.submitted}
        onEdit={(draft) => setSearch({ draft, submitted: "" })}
        onSearch={openSearch}
        onBack={closeSearch}
        onOpenPost={openPost}
        onOpenProfile={setViewedProfile}
        onLike={toggleLike}
        onMenu={setMenuTarget}
        flash={flash}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#14233C]">
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#14233C] px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
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
          target={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget.contentId !== undefined) {
              setPosts((current) => current.filter((post) => post.id !== deleteTarget.contentId));
              if (selectedPost?.id === deleteTarget.contentId) setSelectedPost(null);
            }
            setDeleteTarget(null);
            flash("Post deleted");
          }}
        />
      )}
      <div className="mx-auto grid min-h-screen max-w-[1300px] grid-cols-1 md:grid-cols-[88px_minmax(0,680px)] xl:grid-cols-[250px_minmax(0,680px)_330px]">
        <aside className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#DCE3EE] bg-white/95 px-1 backdrop-blur-xl md:sticky md:top-0 md:h-screen md:overflow-y-auto md:border-r md:border-t-0 md:px-3 xl:px-5">
          <div className="flex h-full items-center justify-around md:flex-col md:items-stretch md:justify-start">
            <button
              className="hidden h-20 items-center gap-3 px-3 md:flex"
              onClick={() => navigate("Home")}
              aria-label="Westbridge Connect home"
            >
              <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#1E63B5] text-lg font-extrabold text-white shadow-[0_7px_18px_rgba(30,99,181,.25)]">
                W
              </div>
              <div className="hidden text-left xl:block">
                <p className="text-[15px] font-extrabold leading-tight">Westbridge</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#708096]">
                  Connect
                </p>
              </div>
            </button>
            <nav
              aria-label="Main navigation"
              className="flex w-full items-center justify-around md:flex-col md:items-stretch md:gap-1"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.label)}
                    className={`${item.mobilePrimary ? "flex" : "hidden md:flex"} group relative h-14 min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-left transition md:h-auto md:flex-none md:flex-row md:justify-start md:gap-4 md:px-3 md:py-3 ${
                      active
                        ? "bg-[#EAF2FC] font-bold text-[#175CA9]"
                        : "font-semibold text-[#516176] hover:bg-[#F0F4F9] hover:text-[#14233C]"
                    }`}
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    title={item.label}
                  >
                    <Icon size={22} strokeWidth={active ? 2.5 : 1.9} />
                    <span className="text-xs md:hidden xl:inline xl:text-base">{item.label}</span>
                    {item.badge && (
                      <span className="absolute left-[calc(50%+0.3rem)] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#E05454] px-1 text-[9px] font-bold text-white md:left-7 md:top-2 xl:left-auto xl:right-4">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <MobileMoreNav currentPage={currentPage} navigate={navigate} />
            </nav>
            <button
              onClick={() => {
                navigate("Home");
                window.setTimeout(() => document.getElementById("composer")?.focus(), 50);
              }}
              className="mt-5 hidden h-12 items-center justify-center gap-2 rounded-xl bg-[#1E63B5] font-bold text-white shadow-[0_8px_20px_rgba(30,99,181,.22)] hover:bg-[#164F93] md:flex"
            >
              <PenLine size={18} />
              <span className="hidden xl:inline">Create post</span>
            </button>
            <SidebarProfile
              profile={profile}
              onOpenProfile={() => navigate("Profile")}
              onLogOut={() => changeSession(true)}
            />
          </div>
        </aside>
        <main className="min-w-0 border-[#DCE3EE] bg-white pb-20 md:border-r md:pb-0">
          {settingsView && (
            <SettingsPage
              profile={profile}
              onLogOut={() => changeSession(true)}
              onSaveProfile={saveProfile}
              view={settingsView}
              setView={setSettingsView}
              onBack={closeSettings}
              flash={flash}
            />
          )}
          <div hidden={settingsView !== null}>
            {activePage === "Search" && (
              <div hidden={Boolean(selectedPost || viewedProfile)}>{pageContent.Search}</div>
            )}
            {selectedPost ? (
              <PostDetailPage
                profile={profile}
                post={posts.find((post) => post.id === selectedPost.id) ?? selectedPost}
                onBack={() => setSelectedPost(null)}
                onLike={toggleLike}
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
              activePage !== "Search" && pageContent[activePage]
            )}
          </div>
        </main>
        <RightRail navigate={navigate} onSearch={openSearch} />
      </div>
      <button
        onClick={() => {
          navigate("Home");
          window.setTimeout(() => document.getElementById("composer")?.focus(), 50);
        }}
        className="fixed bottom-20 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#1E63B5] text-white shadow-[0_10px_28px_rgba(30,99,181,.32)] md:hidden"
        aria-label="Create post"
      >
        <PenLine size={22} />
      </button>
    </div>
  );
}
