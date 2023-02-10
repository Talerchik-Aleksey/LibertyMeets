import * as EmailValidator from "email-validator";

export function validateEmail(email: string): boolean {
  return EmailValidator.validate(email);
}
const pattern =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\`\~\+\=\,\-\[\]\{\}\(\)\|\\;:'",.<>\/?])[A-Za-z\d!@#\$%\^&\*\`\~\+\=\,\-\[\]\{\}\(\)\|\\;:'",.<>\/?]{8,}/;

export const PASSWORD_VALIDATION_PATTERN = new RegExp(pattern);
