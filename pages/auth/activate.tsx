import { signOut, useSession } from "next-auth/react";

export default function ActivatePage() {
  const { data: session } = useSession();

  if (session) {
    signOut();
  }

  return (
    <>
      <h2>Error</h2>
      <p>
        Your account has been created, but in order to use it fully, you need to
        activate your email. We have sent a confirmation email to the address
        you provided. Please follow the instructions in the email to complete
        the activation process. If you have not received the email, please check
        your spam folder.
      </p>
    </>
  );
}
