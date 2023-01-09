import { useRouter } from "next/router";
import LibertyMeetsLogo from "../LibertyMeetsLogo";

export default function Footer() {
  const router = useRouter();

  return (
    <footer>
      <div style={{ width: 926 }}>
        <LibertyMeetsLogo size={0.5} />
      </div>
      <div className="clickableText" onClick={() => router.push("/about")}>
        About LibertyMeets
      </div>
      <div>LibertyMeets ©️ 2022</div>
    </footer>
  );
}
