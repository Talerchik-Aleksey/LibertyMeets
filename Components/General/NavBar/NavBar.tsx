import { Button, Input } from "antd";
import styles from "./NavBar.module.scss";
import Image from "next/image";
import { CATEGORIES } from "../../../constants/constants";
import { useRouter } from "next/router";

type NavBarProps = {
  changeCategory: (category: string) => void;
};

export default function NavBar(props: NavBarProps) {
  const { changeCategory } = props;
  const router = useRouter();
  const pop = {
    "undefined ": "All",
    "social ": "Social",
    "volunteer ": "Volunteer",
    "professional ": "Professional",
    "campaigns ": "Campaigns",
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.tabs}>
        {CATEGORIES.map((item, index) => (
          <Button
            className={
              pop[`${router.query.category?.toString() as keyof object} `] ===
              item
                ? styles.activeButton
                : styles.button
            }
            key={index}
            onClick={() => {
              changeCategory(item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className={styles.location}>
        <div className={styles.radius}>
          <span className={styles.text}>Radius</span>
          <Input
            suffix={<Image src="/decor/mi.svg" alt="" width={16} height={16} />}
            placeholder="50mi"
            className={styles.mi}
          />
        </div>
        <div className={styles.place}>
          <span className={styles.text}>Zip Code</span>
          <Input
            suffix={
              <Image src="/decor/location2.svg" alt="" width={18} height={18} />
            }
            placeholder="20103"
            className={styles.loc}
          />
        </div>
      </div>
    </div>
  );
}
