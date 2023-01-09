import Image from "next/image";
import { Inter } from "@next/font/google";
import CrossesOnBackground from "../Components/General/CrossesOnBackground";
import styles from "../styles/mainPage.module.css";
import LibertyMeetsLogo from "../Components/LibertyMeetsLogo";

const inter = Inter({ subsets: ["latin"] });

export default function MainPage() {
  const phrases=["a New Job", "for Trivia Night", "to Take Action", "the Neighbors"]
  return (
    <>
      <CrossesOnBackground />
      <div style={{ height: "754px" }}>
        <div style={{"display":"flex"}}>
        <LibertyMeetsLogo size={1}/>
        <div className={styles.goods}> a new Job</div>
        </div>

        LibertyMeets is a classifieds website for finding freedom-friendly folks
        near you.
      </div>
      <div style={{ height: "555px" }} className={styles.valuesBlock}>
        Our Values
        <div className={styles.valuesText}>Liberty</div>
        <div className={styles.valuesText}>Community</div>
        <div className={styles.valuesText}>Privacy</div>
      </div>
      <div style={{ height: "660px" }} className={styles.purpleBlock}>
        <Image
          src="/decor/Frame 36732.png"
          alt="Frame 36732"
          width={524}
          height={440}
        />
        “LibertyMeets has helped us find new like-minded friends in our town.
        Finally a platform with people who have our values and is more than
        sitting behind a keyboard.” Bob & Jessica Smith
      </div>
    </>
  );
}
