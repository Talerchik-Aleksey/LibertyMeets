import addressparser from "addressparser";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAssetError } from "next/dist/client/route-loader";
import { getPost } from "../services/posts";
import { handleReplyToPost } from "../services/reply";


const baseDomain = 'mg.example.com';

const processReferences = (referencesStr: string) => {
  const re = new RegExp('\\<?([\\w\\d-])@' + baseDomain + '\\>?');
    return referencesStr.split(/\s+/)
      .filter(Boolean)
      .map(s => s.trim())
      .filter(Boolean)
      .map((ref) => {
        const t = ref.match(re);
        if (!t) {
          return false;
        }
        return t[1];
      })
      .filter(Boolean)
      .shift();
  };
  

xdescribe("Webhooks service", () => {
  it("parses References string", async () => {
    const a = processReferences('<9@mg.example.com> <20230125092916.3ac39bc2227d4852@mg.twelvedevs.com>');
    console.log(a);
    expect(a).toBe('9');
  });
});

xdescribe('addressparser', () => {
  it('can parse', () => {
    const fromStr = "Vadim Burdylev <vburdylev@twelvedevs.com>";
    const a = addressparser(fromStr);
    console.log(a);
    expect(a).toBeTruthy();
    expect(a.length).toBe(1);
    expect(a[0].address).toBe("vburdylev@twelvedevs.com");
    expect(a[0].name).toBe("Vadim Burdylev");
  });
});
