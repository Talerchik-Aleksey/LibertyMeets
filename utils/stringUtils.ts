export function validateEmail(email: string): boolean {
  // const start = /^/;
  // const username = /([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+")/;
  // const at = /@/;
  // const domain =
  //   /((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  // const end = /$/;

  // const regex = new RegExp(
  //   `${start.source}${username.source}${at.source}${domain.source}${end.source}`
  // );

  // return regex.test(email.toLocaleLowerCase());

  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return expression.test(email);
}
