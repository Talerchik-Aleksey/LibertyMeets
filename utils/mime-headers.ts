import config from "config";

const baseDomain = config.get<string>("emails.replySetup.baseDomain");

export const extractThreadIdFromHeaderStr = (headerStr: string) => {
  const re = new RegExp('\\<?([0-9A-Fa-f\\-]+)@' + baseDomain + '\\>?');
  return headerStr.split(/\s+/)
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
