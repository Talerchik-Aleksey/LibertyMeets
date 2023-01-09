import Image from "next/image";

type propsType = { size: number };
interface Dic {
  [key: string]: JSX.Element;
}

export default function LibertyMeetsLogo(props: propsType) {
  const d: Dic = {
    b: (
      <Image
        src="/letters/b.svg"
        alt="b"
        width={44 * props.size}
        height={60 * props.size}
      />
    ),
    e: (
      <Image
        src="/letters/e.svg"
        alt="e"
        width={36 * props.size}
        height={39 * props.size}
      />
    ),
    i: (
      <Image
        src="/letters/i.svg"
        alt="i"
        width={18 * props.size}
        height={55 * props.size}
      />
    ),
    L: (
      <Image
        src="/letters/L.svg"
        alt="L"
        width={46 * props.size}
        height={56 * props.size}
      />
    ),
    M: (
      <Image
        src="/letters/M.svg"
        alt="M"
        width={76 * props.size}
        height={57 * props.size}
      />
    ),
    r: (
      <Image
        src="/letters/r.svg"
        alt="r"
        width={33 * props.size}
        height={38 * props.size}
      />
    ),
    s: (
      <Image
        src="/letters/s.svg"
        alt="s"
        width={29 * props.size}
        height={39 * props.size}
      />
    ),
    t: (
      <Image
        src="/letters/t.svg"
        alt="t"
        width={26 * props.size}
        height={50 * props.size}
      />
    ),
    y: (
      <Image
        src="/letters/y.svg"
        alt="y"
        width={42 * props.size}
        height={56 * props.size}
        style={{ marginBottom: `${-18 * props.size}px` }}
      />
    ),
  };

  return (
    <>
      <div style={{ verticalAlign: "bottom" }}>
        {"LibertyMeets".split("").map((letter) => d[letter])}
      </div>
    </>
  );
}
