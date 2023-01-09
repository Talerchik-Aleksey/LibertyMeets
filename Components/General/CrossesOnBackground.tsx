import Image from "next/image";

export default function CrossesOnBackground() {
  return (
    <>
      <Image
        src="/decor/Rectangle 865.png"
        alt=""
        width={238}
        height={280}
        className="rectangle-right"
      />
      <Image
        src="/decor/Rectangle 864.png"
        alt=""
        width={469}
        height={258}
        className="rectangle-left"
      />
    </>
  );
}
