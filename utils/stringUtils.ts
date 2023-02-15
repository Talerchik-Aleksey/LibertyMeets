import * as EmailValidator from "email-validator";

export function validateEmail(email: string): boolean {
  return EmailValidator.validate(email);
}
const pattern =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\"\<\>\$%\^&\*\`\~\+\_\‼\¿\¡\?\=\,\-\[\]\{\}\(\)\|\\;:'",.<>\/?])[A-Za-z\d!@#\"\<\>\$%\^&\*\`\~\+\‼\¿\¡\_\?\=\,\-\[\]\{\}\(\)\|\\;:'",.<>\/?]{8,}/;

export const PASSWORD_VALIDATION_PATTERN = new RegExp(pattern);
