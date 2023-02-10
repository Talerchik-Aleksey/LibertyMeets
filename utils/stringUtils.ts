import * as EmailValidator from "email-validator";

export function validateEmail(email: string): boolean {
  return EmailValidator.validate(email);
}

export const PASSWORD_VALIDATION_PATTERN = new RegExp(
  // "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
  "^.{8,}$"
);
