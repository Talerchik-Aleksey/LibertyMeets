import { extractThreadIdFromHeaderStr } from "../utils/mime-headers";

describe("MIME header parser", () => {
  it("parses References string with numeric thread id", async () => {
    const a = extractThreadIdFromHeaderStr('<9@mg.example.com> <20230125092916.3ac39bc2227d4852@mg.twelvedevs.com>');
    expect(a).toBe('9');
  });

  it("parses References string with thread id as uuid", async () => {
      const a = extractThreadIdFromHeaderStr(' <e389593f-EA57-4286-83df-b202319b4825@mg.example.com> <20230125092916.3ac39bc2227d4852@mg.twelvedevs.com>');
      expect(a).toBe('e389593f-EA57-4286-83df-b202319b4825');
    });
});
