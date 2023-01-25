import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import HeaderCreateProfileLogOut from "./HeaderCreateProfileLogOut/HeaderCreateProfileLogOut";
import GuestHeader from "./HeaderSignUpLogIn/GuestHeader";
import { useRouter } from "next/router";

export default function Header() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const router = useRouter();
  const url = router.asPath.toString();

  useEffect(() => {
    if (session) {
      console.log(router.asPath.toString());
      setIsLogin(true);
    }
  }, [session]);

  return (
    <>
      {isLogin ? (
        <>
          <HeaderCreateProfileLogOut />
        </>
      ) : (
        <>
          <GuestHeader />
        </>
      )}
    </>
  );

  // return <>{isLogin ? <HeaderCreateProfileLogOut /> : <GuestHeader />}</>;
}
