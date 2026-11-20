import React, { useState } from "react";
import { X, Trash2, Copy, VolumeX } from "lucide-react";
import { MenuTarget } from "../types";

// Options Menu Modal
export function OptionsMenu({
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
  const isOwn = target.handle === "@alexm";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-pop-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl text-xs font-semibold"
      >
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            flash("Link copied to clipboard");
            onClose();
          }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100"
        >
          <Copy size={15} />
          <span>Copy link</span>
        </button>

        {!isOwn && (
          <button
            onClick={() => {
              flash(`Muted ${target.name}`);
              onClose();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            <VolumeX size={15} />
            <span>Mute @{target.handle.replace("@", "")}</span>
          </button>
        )}

        {isOwn && (
          <button
            onClick={() => {
              onClose();
              onDeleteRequest(target);
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={15} />
            <span>Delete post</span>
          </button>
        )}
      </div>
    </div>
  );
}

// Delete Confirmation
export function DeleteConfirmation({
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
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-pop-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-5 shadow-xl text-center"
      >
        <h3 className="text-sm font-bold text-slate-900">Delete this post?</h3>
        <p className="mt-1 text-xs text-slate-400">This action cannot be undone.</p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Profile Modal
export function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  flash,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    bio: string;
    location: string;
    website: string;
  };
  onSave: (data: { name: string; bio: string; location: string; website: string }) => void;
  flash: (msg: string) => void;
}) {
  const [formData, setFormData] = useState(initialData);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    flash("Profile updated");
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-pop-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl text-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="grid h-6 w-6 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Bio</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-1.5 font-bold text-white hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Toast
export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xl animate-pop-in md:bottom-8">
      {message}
    </div>
  );
}
