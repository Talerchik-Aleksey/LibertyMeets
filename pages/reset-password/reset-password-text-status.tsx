type ErrorTextType = {
  [errorCode: number]: string;
};

const errorText: ErrorTextType = {
  200: "",
  404: "Извините, такая пользовательская учетная запись не найдена.",
  500: "Проблема с сервером. Попробуйте позже.",
};

export default function ResetPasswodTextStatus({
  errCode,
}: {
  errCode: number;
}) {
  return (
    <>
      <p>
        {errCode in errorText
          ? errorText[errCode]
          : `Произошла ошибка - ${errCode}`}
      </p>
    </>
  );
}
