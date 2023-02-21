import { AutoComplete, Button, Input } from "antd";
import Image from "next/image";
import { CATEGORIES } from "../../../constants/constants";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import styles from "./NavBar.module.scss";

type NavBarProps = {
  zip: string | undefined;
  radius: string | undefined;
  appUrl: string;
  setLat: Dispatch<SetStateAction<number | undefined>>;
  setLng: Dispatch<SetStateAction<number | undefined>>;
  changeCategory: (category: string) => void;
  searchByZipCode: (zipCode: string) => void;
  searchByRadius: (radius: string) => void;
};

export default function NavBar(props: NavBarProps) {
  const { zip, radius, changeCategory, searchByZipCode, searchByRadius } =
    props;
  const router = useRouter();
  const categoryList: Record<string, string> = {
    "": "All",
    undefined: "All",
    Social: "Social",
    Volunteer: "Volunteer",
    Professional: "Professional",
    Campaigns: "Campaigns",
  };
  const autoCompleteOption = [
    { value: "5" },
    { value: "10" },
    { value: "25" },
    { value: "50" },
    { value: "100" },
  ];

  return (
    <div className={styles.navbar}>
      <div className={styles.tabs}>
        {CATEGORIES.map((item, index) => (
          <Button
            className={
              categoryList[
                `${router.query.category?.toString() as keyof object}`
              ] === item
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
          <AutoComplete
            options={autoCompleteOption}
            onChange={searchByRadius}
            placeholder="any"
            className={styles.mi}
            value={radius}
          />
        </div>
        <div className={styles.place}>
          <span className={styles.text}>Zip Code</span>
          <Input
            suffix={
              <Image src="/decor/location2.svg" alt="" width={18} height={18} />
            }
            placeholder=""
            className={styles.loc}
            onChange={(e) => searchByZipCode(e.target.value)}
            value={zip}
          />
        </div>
      </div>
    </div>
  );
}
