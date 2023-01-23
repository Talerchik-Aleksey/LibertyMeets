import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import HeaderCreateProfileLogOut from "./Header CreateProfileLogOut/HeaderCreateProfileLogOut";
import GuestHeader from "./Header SignUpLogIn/GuestHeader";

export default function Header() {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  useEffect(() => {
    if (session) {
      setIsLogin(true);
    }
  }, [session]);

  return <>{isLogin ? <HeaderCreateProfileLogOut /> : <GuestHeader />}</>;
}
