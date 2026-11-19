import { useEffect, useRef, useState, type FormEvent } from "react";

import { firebaseApiKey, rememberCredential } from "./session";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const googleScriptUrl = "https://accounts.google.com/gsi/client";

type GoogleIdentity = {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: {
      theme: "outline";
      size: "large";
      text: "signin_with" | "signup_with";
      width: number;
    },
  ) => void;
};

function getGoogleIdentity() {
  return (window as Window & { google?: { accounts?: { id?: GoogleIdentity } } }).google?.accounts
    ?.id;
}

let googleLoad: Promise<GoogleIdentity> | undefined;

function loadGoogleIdentity() {
  if (!googleLoad) {
    googleLoad = new Promise<GoogleIdentity>((resolve, reject) => {
      const existing = getGoogleIdentity();
      if (existing) {
        resolve(existing);
        return;
      }
      const script = document.createElement("script");
      script.src = googleScriptUrl;
      script.async = true;
      script.onload = () => {
        const identity = getGoogleIdentity();
        if (identity) resolve(identity);
        else reject(new Error("Google sign-in couldn't load."));
      };
      script.onerror = () => {
        script.remove();
        reject(new Error("Google sign-in couldn't load."));
      };
      document.head.appendChild(script);
    }).catch((error) => {
      googleLoad = undefined;
      throw error;
    });
  }
  return googleLoad;
}

const authMessages: Record<string, string> = {
  EMAIL_EXISTS: "An account already exists with this email. Try signing in.",
  EMAIL_NOT_FOUND: "The email or password is incorrect.",
  INVALID_LOGIN_CREDENTIALS: "The email or password is incorrect.",
  INVALID_PASSWORD: "The email or password is incorrect.",
  OPERATION_NOT_ALLOWED: "This sign-in method is unavailable.",
  TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts. Try again later.",
  USER_DISABLED: "This account is disabled.",
  WEAK_PASSWORD: "Choose a stronger password.",
};

async function authenticate(
  method: "signUp" | "signInWithPassword" | "signInWithIdp",
  fields: Record<string, string>,
  signal: AbortSignal,
) {
  const url = new URL(`https://identitytoolkit.googleapis.com/v1/accounts:${method}`);
  url.searchParams.set("key", firebaseApiKey);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...fields, returnSecureToken: true }),
    signal,
  });
  const result: {
    email?: string;
    idToken?: string;
    refreshToken?: string;
    needConfirmation?: boolean;
    error?: { message?: string };
  } = await response.json();
  if (result.needConfirmation) {
    throw new Error("This email is already associated with another sign-in method.");
  }
  if (!response.ok || !result.idToken || !result.refreshToken || !result.email) {
    const code = result.error?.message?.split(" : ")[0] ?? "";
    throw new Error(authMessages[code] ?? "We couldn't complete sign-in. Please try again.");
  }
  if (!signal.aborted) rememberCredential(result.refreshToken);
  return result.email;
}

type AuthPageProps = {
  mode: "sign-in" | "register";
  onAuthenticated: (email: string) => void;
};

const fieldClass = "field-control mt-1.5";

export function AuthPage({ mode, onAuthenticated }: AuthPageProps) {
  const registering = mode === "register";
  const [error, setError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [busy, setBusy] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const authenticatedRef = useRef(onAuthenticated);

  useEffect(() => {
    authenticatedRef.current = onAuthenticated;
  }, [onAuthenticated]);

  useEffect(() => {
    let active = true;
    const button = buttonRef.current;
    if (button && firebaseApiKey && googleClientId) {
      loadGoogleIdentity()
        .then((identity) => {
          if (!active) return;
          identity.initialize({
            client_id: googleClientId,
            callback: ({ credential }) => {
              if (!active) return;
              void submit("signInWithIdp", {
                requestUri: window.location.origin,
                postBody: new URLSearchParams({
                  id_token: credential,
                  providerId: "google.com",
                }).toString(),
              });
            },
          });
          identity.renderButton(button, {
            theme: "outline",
            size: "large",
            text: registering ? "signup_with" : "signin_with",
            width: 240,
          });
        })
        .catch(() => {
          if (active) setGoogleError("Google sign-in couldn't load. Please try again later.");
        });
    }
    return () => {
      active = false;
      requestRef.current?.abort();
      requestRef.current = null;
      button?.replaceChildren();
    };
  }, [registering]);

  async function submit(
    method: Parameters<typeof authenticate>[0],
    fields: Parameters<typeof authenticate>[1],
  ) {
    if (!firebaseApiKey || requestRef.current) return;
    const request = new AbortController();
    requestRef.current = request;
    setBusy(true);
    setError("");
    try {
      const email = await authenticate(method, fields, request.signal);
      if (!request.signal.aborted) authenticatedRef.current(email);
    } catch (cause) {
      if (!request.signal.aborted) {
        setError(
          cause instanceof Error && !(cause instanceof TypeError)
            ? cause.message
            : "Couldn't connect. Check your internet connection and try again.",
        );
      }
    } finally {
      if (!request.signal.aborted) {
        requestRef.current = null;
        setBusy(false);
      }
    }
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (registering && password !== form.get("confirmPassword")) {
      setError("The passwords don't match.");
      return;
    }
    void submit(registering ? "signUp" : "signInWithPassword", { email, password });
  }

  return (
    <section className="w-full">
      <h1 className="page-title">{registering ? "Create your account" : "Sign in"}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        {registering ? "Join Westbridge Connect." : "Welcome back to Westbridge Connect."}
      </p>

      <form onSubmit={submitEmail} className="mt-6 space-y-4" aria-busy={busy}>
        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            disabled={!firebaseApiKey || busy}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            type="password"
            name="password"
            autoComplete={registering ? "new-password" : "current-password"}
            required
            minLength={registering ? 6 : undefined}
            disabled={!firebaseApiKey || busy}
            className={fieldClass}
          />
        </label>
        {registering && (
          <label className="block text-sm font-semibold">
            Confirm password
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              disabled={!firebaseApiKey || busy}
              className={fieldClass}
            />
          </label>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        {!firebaseApiKey && (
          <p className="text-sm text-muted">
            Account registration and sign-in are not configured yet.
          </p>
        )}
        <button
          type="submit"
          disabled={!firebaseApiKey || busy}
          className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Please wait…" : registering ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="mt-5 flex items-center gap-3 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        {firebaseApiKey && googleClientId ? (
          <div ref={buttonRef} className="min-h-10" />
        ) : (
          <button
            type="button"
            disabled
            className="rounded-lg border border-control px-4 py-2.5 text-sm text-muted"
          >
            {registering ? "Sign up with Google" : "Sign in with Google"}
          </button>
        )}
        {firebaseApiKey && !googleClientId && (
          <p className="text-sm text-muted">Google sign-in is not configured yet.</p>
        )}
        {googleError && (
          <p role="status" className="text-center text-sm text-muted">
            {googleError}
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {registering ? "Already have an account?" : "New to Westbridge Connect?"}{" "}
        <a
          href={registering ? "#/sign-in" : "#/register"}
          className="font-bold text-accent hover:underline"
        >
          {registering ? "Sign in" : "Create an account"}
        </a>
      </p>
    </section>
  );
}
