import addressparser from "addressparser";
import { removeTagsFromEmail } from "../utils/stringUtils";

describe("addressparser", () => {
  it("can parse", () => {
    const fromStr = "Vadim Burdylev <vburdylev@twelvedevs.com>";
    const a = addressparser(fromStr);
    expect(a).toBeTruthy();
    expect(a.length).toBe(1);
    expect(a[0].address).toBe("vburdylev@twelvedevs.com");
    expect(a[0].name).toBe("Vadim Burdylev");
  });
});

describe("removing tags", () => {
  it("removes special tags from email", () => {
    const email = "auto+remove_123@example.com";
    expect(removeTagsFromEmail(email)).toBe("auto@example.com");
  });

  it("throws an error when incorrect parameters used", () => {
    const email = "auto+remove_123_example.com";
    expect(() => removeTagsFromEmail(email)).toThrow(
      "Incorrect email format provided"
    );
  });
});
