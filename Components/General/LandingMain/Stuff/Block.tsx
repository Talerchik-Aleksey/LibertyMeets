import styles from "./Block.module.scss";
import Image from "next/image";

type line = {
  text: string;
  isMarked: boolean;
};

type imgProps = {
  src: string;
  width: number;
  height: number;
};

type PropsType = {
  img: imgProps;
  title: string;
  lines: line[];
};

export default function Block({ img, title, lines }: PropsType) {
  return (
    <>
      <div className={styles.block}>
        <h2>{title}</h2>
        <div>
        <Image
          src={img.src}
          alt={title}
          width={img.width}
          height={img.height}
        />
        <div>
        {lines.map((line) => (
          <div
            className={line.isMarked ? styles.markedLine : styles.unmarkedLine}
          >
            {line.text}
          </div>
        ))}
        </div>
      </div>
      </div>
    </>
  );
}
