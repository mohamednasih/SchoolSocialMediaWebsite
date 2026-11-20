import React, { useState } from "react";
import { Heart, MessageCircle, UserPlus, CheckCheck } from "lucide-react";
import { PageHeader } from "./PageHeader";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      icon: Heart,
      color: "text-rose-500 bg-rose-50",
      title: "Maya Chen liked your post",
      snippet: "“Working on a clean, minimal interface for my new web project...”",
      time: "25m ago",
      unread: true,
    },
    {
      id: 2,
      type: "reply",
      icon: MessageCircle,
      color: "text-blue-500 bg-blue-50",
      title: "Liam Vance replied to your post",
      snippet: "“The subtle border-slate-200 styling feels much softer on eyes...”",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      type: "follow",
      icon: UserPlus,
      color: "text-emerald-500 bg-emerald-50",
      title: "Sarah Jenkins started following you",
      snippet: "Design systems lead. Simplifying complexity into modular UI...",
      time: "3h ago",
      unread: false,
    },
    {
      id: 4,
      type: "like",
      icon: Heart,
      color: "text-rose-500 bg-rose-50",
      title: "David Park liked your post",
      snippet: "“Simplicity in layout is about what you choose to leave out...”",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        action={
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <CheckCheck size={15} />
            <span>Mark all read</span>
          </button>
        }
      />

      <div className="divide-y divide-slate-100">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className={`flex items-start gap-3.5 px-4 py-3.5 transition hover:bg-slate-50 sm:px-6 ${
                item.unread ? "bg-slate-50/70" : "bg-white"
              }`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.color}`}
              >
                <Icon size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900">{item.title}</p>
                  <span className="text-[11px] text-slate-400 shrink-0">{item.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>
              </div>

              {item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600 mt-1.5" />}
            </article>
          );
        })}
      </div>
    </>
  );
}
