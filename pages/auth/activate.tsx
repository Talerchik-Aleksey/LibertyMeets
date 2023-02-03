import { signOut, useSession } from "next-auth/react";
import AuthActivated from "../../Components/AuthActivated/AuthActivated";

export default function ActivatePage() {
  const { data: session } = useSession();

  if (session) {
    signOut();
  }

  return (
    <AuthActivated />
  );
}
