import { useEffect, useId, useRef, type ReactNode } from "react";

const postCharacterLimit = 280;

type CreatePostProps = {
  avatar: ReactNode;
  draft: string;
  onDraftChange: (draft: string) => void;
  onPublish: () => void;
  onCancel: () => void;
};

export function CreatePost({ avatar, draft, onDraftChange, onPublish, onCancel }: CreatePostProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  const cancel = () => {
    dialogRef.current?.close();
    onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        cancel();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl border border-line bg-white text-ink shadow-xl backdrop:bg-ink/45"
    >
      <h2
        id={titleId}
        className="border-b border-line px-5 py-4 text-xl font-bold tracking-tight sm:px-6"
      >
        Create post
      </h2>
      <section className="px-4 py-5 sm:px-6">
        <div className="mb-3 flex items-center gap-3">
          {avatar}
          <span className="text-sm text-muted">Everyone</span>
        </div>
        <textarea
          autoFocus
          aria-label="Post text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value.slice(0, postCharacterLimit))}
          rows={4}
          className="field-control min-h-24 resize-y leading-6"
          placeholder="Share something with your school…"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-xs font-medium text-muted tabular-nums">
            Text only · {postCharacterLimit - draft.length} left
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={cancel}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-tint"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                dialogRef.current?.close();
                onPublish();
              }}
              disabled={!draft.trim()}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      </section>
    </dialog>
  );
}
