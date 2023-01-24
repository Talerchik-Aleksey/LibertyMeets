import axios from "axios";
import { useEffect, useState } from "react";
import { generateFromString } from "generate-avatar";

type PropsType = {
  appUrl: string;
  threadId: string;
};
type Message = {
  message: string;
  user_id: number;
};

export default function Thread({ appUrl, threadId }: PropsType) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${appUrl}/api/threads/get-messages`, {
        params: { threadId },
      });
      setMessages(res.data.data.messages);
    })();
  }, []);

  return (
    <>
      {messages.map((item) => (
        <div>
          <img
            src={`data:image/svg+xml;utf8,${generateFromString(
              `${item.user_id}`
            )}`}
            height={15}
            width={15}
          />
          {item.message}
        </div>
      ))}
    </>
  );
}
