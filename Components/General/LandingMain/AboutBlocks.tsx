import AboutBlock from "./AboutBlock";

const blocksInfo = [
  {
    title: "О компании",
    img: { src: "decor/Icon 1.svg", width: 147, height: 150 },
    lines: [
      {
        isMarked: true,
        text: "Надежная платформа для общения свободомыслящих людей",
      },
      {
        isMarked: true,
        text: "Способствовать созданию сильных местных сообществ и рабочей среды",
      },
      {
        isMarked: true,
        text: "Позволить волонтерам/донорам напрямую связываться с кампаниями",
      },
      {
        isMarked: true,
        text: "Усилить социальное, политическое и экономическое влияние движения за свободу",
      },
    ],
  },
  {
    title: "Преимущества",
    img: { src: "decor/Icon 2.svg", width: 145, height: 144 },
    lines: [
      { isMarked: true, text: "Доступ к аудитории, разделяющей ваши ценности" },
      { isMarked: true, text: "Простота и бесплатность использования" },
      {
        isMarked: true,
        text: "Как и в Craigslist, ваши сообщения анонимны.",
      },
      {
        isMarked: true,
        text: "Сосредоточены на сохранении вашей конфиденциальности",
      },
    ],
  },
  {
    title: "Как это работает",
    img: { src: "decor/Icon 3.svg", width: 135, height: 150 },
    lines: [
      {
        isMarked: false,
        text: "Поиск и размещение вакансий в четырех категориях:",
      },
      { isMarked: true, text: "Социальные (знакомство с единомышленниками)" },
      {
        isMarked: true,
        text: "Станьте волонтером (легко находите способы превратить страсть в действие)",
      },
      {
        isMarked: true,
        text: "Профессиональные (объединяют работодателей и сотрудников на одной странице)",
      },
      {
        isMarked: true,
        text: "Кампании (обойти контроль GOP/RNC над ресурсами)",
      },
    ],
  },
];

export default function AboutBlocks() {
  return (
    <>
      {blocksInfo.map((item, i) => (
        <AboutBlock
          title={item.title}
          img={item.img}
          lines={item.lines}
          key={i}
        />
      ))}
    </>
  );
}
