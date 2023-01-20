import config from "config";
import ejs from "ejs";
import Mailgun from "mailgun-js";

const mailgun = Mailgun({
  apiKey: config.get<string>("mailgun.apiKey"),
  domain: config.get<string>("mailgun.domain"),
  host:"api.eu.mailgun.net"
});

function recipient(a: any) {
  return a.name ? `"${a.name}" <${a.email}>` : a.email;
}

function recipients(list: any) {
  return (list || []).map(recipient).join(", ");
}

async function renderEmailTemplate(ejsFileName: string, params0: any) {
  const params = {
    ...params0,
    user: { name: "MyName" },
    mainAppHost: config.get("emails.mainAppHost"),
    imgPrefix: config.get("emails.imgPrefix"),
  };

  const htmlFile = `${process.cwd()}/${config.get(
    "emails.templatesDir"
  )}/${ejsFileName}.ejs`;

  const result = await ejs.renderFile(htmlFile, params);

  return result as string;
}

type paramsType = {
  from: any;
  subject: string;
  to: string;
  cc: string;
  bcc: string;
  reply_to: string;
};
async function sendEmail(template: string, params: paramsType) {
  let subject: string;
  let body: string;

  const result = await renderEmailTemplate(`${template}/subject`, params);
  subject = result;

  params.subject = subject;
  await renderEmailTemplate(`${template}/body`, params);
  body = result.trim();

  const data: any = {
    from: recipient(params.from),
    subject: subject || params.subject || "",
    html: body,
  };
  let ok = 0;
  if (params.to) {
    data.to = Array.isArray(params.to)
      ? recipients(params.to)
      : recipients([params.to]);
    ok = 1;
  }
  if (params.cc) {
    data.cc = recipients(params.cc);
    ok = 1;
  }
  if (params.bcc) {
    data.bcc = recipients(params.bcc);
    ok = 1;
  }
  if (params.reply_to) {
    data["h:Reply-To"] = params.reply_to;
  } else {
    data["h:Reply-To"] = params.from.email;
  }

  if (!ok) {
    throw new Error("Recipients not found");
  }

  console.log("data", data);
  const res = await mailgun.messages().send(data);
  console.log(res);
}

export { sendEmail };
