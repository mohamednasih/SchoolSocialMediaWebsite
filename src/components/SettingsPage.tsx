import React, { useState } from "react";
import { Lock, Bell, Moon, Shield, KeyRound } from "lucide-react";
import { Page } from "../types";
import { PageHeader } from "./PageHeader";

interface SettingsPageProps {
  navigate: (page: Page) => void;
  flash: (message: string) => void;
}

export function SettingsPage({ navigate, flash }: SettingsPageProps) {
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [notifyLikes, setNotifyLikes] = useState(true);
  const [notifyReplies, setNotifyReplies] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next.length < 8) {
      flash("Password must be at least 8 characters");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      flash("Passwords do not match");
      return;
    }
    flash("Password updated");
    setPasswords({ current: "", next: "", confirm: "" });
    setOpenPasswordModal(false);
  };

  return (
    <>
      <PageHeader title="Settings" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Account */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-black text-slate-900 mb-3">Account</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Username</label>
              <input
                type="text"
                disabled
                value="@alexm"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 cursor-not-allowed"
              />
            </div>
            <button
              onClick={() => setOpenPasswordModal(true)}
              className="mt-1 flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50"
            >
              <KeyRound size={14} />
              <span>Change Password</span>
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-black text-slate-900 mb-3">Notifications</h2>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="font-bold text-slate-900">Likes & Reactions</p>
                <p className="text-slate-400">Receive notifications when someone likes your post</p>
              </div>
              <button
                onClick={() => {
                  setNotifyLikes(!notifyLikes);
                  flash(notifyLikes ? "Like alerts off" : "Like alerts on");
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                  notifyLikes ? "bg-slate-900" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                    notifyLikes ? "translate-x-4" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div>
                <p className="font-bold text-slate-900">Replies & Mentions</p>
                <p className="text-slate-400">Receive notifications when someone replies</p>
              </div>
              <button
                onClick={() => {
                  setNotifyReplies(!notifyReplies);
                  flash(notifyReplies ? "Reply alerts off" : "Reply alerts on");
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                  notifyReplies ? "bg-slate-900" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                    notifyReplies ? "translate-x-4" : "translate-x-0.5"
                  } mt-0.5`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-black text-slate-900 mb-3">Privacy</h2>
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">Private Account</p>
              <p className="text-slate-400">Only approved followers can see your posts</p>
            </div>
            <button
              onClick={() => {
                setPrivateAccount(!privateAccount);
                flash(privateAccount ? "Account is public" : "Account is private");
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                privateAccount ? "bg-slate-900" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition ${
                  privateAccount ? "translate-x-4" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>
        </section>
      </div>

      {/* Password Modal */}
      {openPasswordModal && (
        <div
          onClick={() => setOpenPasswordModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl text-xs"
          >
            <h3 className="text-sm font-black text-slate-900">Change Password</h3>
            <form onSubmit={handlePasswordSave} className="mt-3 space-y-3">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-500 font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpenPasswordModal(false)}
                  className="rounded-lg px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-3.5 py-1.5 font-bold text-white hover:bg-slate-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
