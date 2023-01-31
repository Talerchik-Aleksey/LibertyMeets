import { validateEmail } from "../utils/stringUtils";

describe("validate email", () => {
  it("should validate email 1.com as false", () => {
    expect(validateEmail("1.com")).toBeFalsy();
  });

  it("should validate email email1 as false", () => {
    expect(validateEmail("email1")).toBeFalsy();
  });

  it("should validate email email@gmail.com as true", () => {
    expect(validateEmail("email@gmail.com")).toBeTruthy();
  });

  it("should validate email as false", () => {
    expect(validateEmail("")).toBeFalsy();
  });

  it("should validate email email@yandex.ru as true", () => {
    expect(validateEmail("email@yandex.ru")).toBeTruthy();
  });

  it("should validate email email@gmail.com as false", () => {
    expect(validateEmail("emailgmail.com")).toBeFalsy();
  });
});
