import * as EmailValidator from "email-validator";

export function validateEmail(email: string): boolean {
  return EmailValidator.validate(email);
}
