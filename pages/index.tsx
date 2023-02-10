import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LandingMain from "../Components/General/LandingMain/LandingMain";

export default function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      session?.user && setIsAuthenticated(true);
    })();
  }, [isAuthenticated]);

  return (
    <>
      <LandingMain isAuthenticated={isAuthenticated} />
    </>
  );
}
