import LibertyMeetsLogo from "../LibertyMeetsLogo";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <header>
        <LibertyMeetsLogo size={0.5} />
        <div className="clickableText" onClick={() => signOut()}>
          Log out
        </div>
        <div className="clickableText" onClick={() => router.push("/reset-password")}>
          Reset password
        </div>
      </header>
    );
  }

  return (
    <header>
      <LibertyMeetsLogo size={0.5} />
      <div className="clickableText" onClick={() => signIn()}>
        Log in
      </div>
    </header>
  );
}
