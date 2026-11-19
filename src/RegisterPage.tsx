import { useEffect } from "react";
import { AccountLayout } from "./AccountLayout";
import { AuthPage } from "./AuthPage";

export function RegisterPage({ onAuthenticated }: { onAuthenticated: (email: string) => void }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Register · Westbridge Connect";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <AccountLayout>
      <AuthPage mode="register" onAuthenticated={onAuthenticated} />
    </AccountLayout>
  );
}
