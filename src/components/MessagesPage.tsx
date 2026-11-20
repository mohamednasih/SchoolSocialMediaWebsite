import React, { useState, useEffect, useRef } from "react";
import { Search, Send, ArrowLeft } from "lucide-react";
import { Conversation, UserProfile } from "../types";
import { Avatar } from "./Avatar";
import { conversations as defaultConversations } from "../data/initialData";

interface MessagesPageProps {
  initialTargetUser?: UserProfile | null;
  flash: (message: string) => void;
}

export function MessagesPage({ initialTargetUser, flash }: MessagesPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>(defaultConversations);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTargetUser) {
      const existing = conversations.find(
        (c) => c.name.toLowerCase() === initialTargetUser.name.toLowerCase(),
      );
      if (existing) {
        setActiveChatId(existing.id);
        setMobileShowChat(true);
      } else {
        const newConv: Conversation = {
          id: Date.now(),
          name: initialTargetUser.name,
          handle: initialTargetUser.handle,
          initials: initialTargetUser.initials,
          tone: initialTargetUser.tone,
          preview: "Started new conversation",
          time: "Just now",
          unread: false,
          online: initialTargetUser.online,
          messages: [
            {
              id: 1,
              sender: "them",
              text: `Hey Alex! Glad to connect with you.`,
              time: "Just now",
            },
          ],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveChatId(newConv.id);
        setMobileShowChat(true);
      }
    }
  }, [initialTargetUser]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeChatId]);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "me" as const,
      text: inputMessage.trim(),
      time: "Just now",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            preview: `You: ${newMsg.text}`,
            time: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      }),
    );

    setInputMessage("");
    flash("Message sent");
  };

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-white">
      {/* Left List */}
      <div
        className={`w-full flex-col border-r border-slate-200/80 md:w-72 lg:w-80 ${
          mobileShowChat ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="border-b border-slate-200/80 px-4 py-3">
          <h2 className="text-base font-black text-slate-900">Messages</h2>
        </div>

        <div className="p-2.5 border-b border-slate-100">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-transparent text-slate-800 focus:outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.map((c) => {
            const isActive = c.id === activeChatId;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveChatId(c.id);
                  setMobileShowChat(true);
                  setConversations((prev) =>
                    prev.map((item) => (item.id === c.id ? { ...item, unread: false } : item)),
                  );
                }}
                className={`flex w-full items-center gap-3 p-3 text-left transition ${
                  isActive ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                <Avatar text={c.initials} tone={c.tone} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-xs font-bold text-slate-900">{c.name}</p>
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                  </div>
                  <p
                    className={`truncate text-xs mt-0.5 ${
                      c.unread ? "font-bold text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {c.preview}
                  </p>
                </div>
                {c.unread && <span className="h-2 w-2 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Thread */}
      <div
        className={`flex-1 flex-col bg-slate-50/40 ${mobileShowChat ? "flex" : "hidden md:flex"}`}
      >
        {activeChat ? (
          <>
            <div className="flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white px-4 shadow-xs">
              <button
                onClick={() => setMobileShowChat(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
              >
                <ArrowLeft size={16} />
              </button>
              <Avatar text={activeChat.initials} tone={activeChat.tone} size="sm" />
              <div>
                <h3 className="text-xs font-bold text-slate-900">{activeChat.name}</h3>
                <p className="text-[10px] text-slate-400">{activeChat.handle}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeChat.messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        isMe
                          ? "bg-slate-900 text-white rounded-br-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Reply to ${activeChat.name}...`}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-white disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-xs text-slate-400">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
