import { useEffect, useState, type ReactNode } from "react";
import { AccountLayout } from "./AccountLayout";
import { AuthPage } from "./AuthPage";
import { RegisterPage } from "./RegisterPage";
import {
  clearSession,
  firebaseApiKey,
  previewActive,
  rememberPreview,
  restoreSession,
  savedCredential,
} from "./session";

type Session =
  | { kind: "guest" | "restoring" | "retry" | "preview" }
  | { kind: "member"; email: string };

function initialSession(): Session {
  if (previewActive()) return { kind: "preview" };
  if (firebaseApiKey && savedCredential()) return { kind: "restoring" };
  return { kind: "guest" };
}

export function SessionGate({
  children,
}: {
  children: (email: string | null, signOut: () => void) => ReactNode;
}) {
  const [session, setSession] = useState(initialSession);
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (session.kind !== "restoring") return;
    const request = new AbortController();
    restoreSession(request.signal)
      .then((email) => {
        if (request.signal.aborted) return;
        if (email) setSession({ kind: "member", email });
        else {
          clearSession();
          setSession({ kind: "guest" });
        }
      })
      .catch(() => {
        if (!request.signal.aborted) setSession({ kind: "retry" });
      });
    return () => request.abort();
  }, [session.kind]);

  useEffect(() => {
    if (session.kind === "preview") rememberPreview();
    if (session.kind === "preview" || session.kind === "member") {
      if (hash === "#/register" || hash === "#/sign-in") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        setHash("");
      }
    }
  }, [hash, session.kind]);

  function signOut() {
    clearSession();
    window.history.replaceState(null, "", "#/sign-in");
    setHash("#/sign-in");
    setSession({ kind: "guest" });
  }

  const signIn = (email: string) => setSession({ kind: "member", email });
  if (session.kind === "member") return children(session.email, signOut);
  if (session.kind === "preview") return children(null, signOut);
  if (session.kind === "guest") {
    if (hash === "#/register") return <RegisterPage onAuthenticated={signIn} />;
    return (
      <AccountLayout>
        <AuthPage mode="sign-in" onAuthenticated={signIn} />
        {!firebaseApiKey && (
          <button
            className="mx-auto mt-5 block rounded-md px-2 py-1 text-sm font-bold text-accent hover:underline"
            onClick={() => setSession({ kind: "preview" })}
          >
            Open school demo
          </button>
        )}
      </AccountLayout>
    );
  }
  return (
    <AccountLayout>
      <p role="status">
        {session.kind === "restoring" ? "Checking your session…" : "Couldn’t check your session."}
      </p>
      {session.kind === "retry" && (
        <div className="mt-4 flex gap-4 text-sm font-semibold text-accent">
          <button onClick={() => setSession({ kind: "restoring" })}>Try again</button>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </AccountLayout>
  );
}
