import LibertyMeetsLogo from "../LibertyMeetsLogo";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  if (session) {
    return (
      <header>
        <LibertyMeetsLogo size={0.5} />
        <div className="clickableText" onClick={() => signOut()}>
          Log out
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
