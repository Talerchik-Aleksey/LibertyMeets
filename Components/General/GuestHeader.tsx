import LibertyMeetsLogo from "../LibertyMeetsLogo";
import { signIn } from "next-auth/react";

export default function GuestHeader() {
  return (
    <header>
      <LibertyMeetsLogo size={0.5} />
      <div className="clickableText" onClick={() => signIn()}>
        Log in
      </div>
    </header>
  );
}
