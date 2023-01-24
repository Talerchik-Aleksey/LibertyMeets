import axios from "axios";
import { useEffect, useState } from "react";
import { generateFromString } from "generate-avatar";

type PropsType = {
  appUrl: string;
  threadId?: string;
  postId?: number;
  userId?: number;
};
type Message = {
  message: string;
  user_id: number;
};

export default function Thread({
  appUrl,
  threadId,
  postId,
  userId,
}: PropsType) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      const params = { threadId, postId, threadUserId: userId };
      try {
        const res = await axios.get(`${appUrl}/api/threads/get-messages`, {
          params,
        });
        setMessages(res.data.data.messages);
      } catch {}
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
