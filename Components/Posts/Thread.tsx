import axios from "axios";
import { useEffect, useState } from "react";

type PropsType = {
  appUrl: string;
  threadId: string;
};
type Message = {
  message: string;
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
        <div>{item.message}</div>
      ))}
    </>
  );
}
