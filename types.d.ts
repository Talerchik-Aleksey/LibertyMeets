import type { Logger } from "pino";

export type NextApiRequestWithLog = NextApiRequest & {
  log: Logger;
};
