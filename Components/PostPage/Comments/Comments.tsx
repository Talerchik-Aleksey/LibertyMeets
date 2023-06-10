import { Avatar, Button, Empty, Form, Input, Typography } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";

import axios from "axios";
import { Comments as CommentsModel } from "../../../models/comments";
import { useState } from "react";
import { Session } from "next-auth";

const { TextArea } = Input;
const { Title, Text } = Typography;

type CommentsProps = {
  appUrl: string;
  postId: number;
  comments: CommentsModel[] | null;
  session: Session | null;
};

export default function Comments(props: CommentsProps) {
  const { appUrl, postId, session } = props;
  const [comments, setComments] = useState(props.comments || []);
  async function sendComment(comment: { content: string }) {
    try {
      const res = await axios.post(`${appUrl}/api/posts/comment`, {
        userId: session?.user.id,
        postId: postId,
        content: comment.content,
      });

      if (res.status === 200) {
        setComments([...comments, res.data.data]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCommentHandler(commentId: number) {
    try {
      console.log(commentId);
      const res = await axios.post(`${appUrl}/api/posts/deleteComment`, {
        commentId,
      });
      if (res.status === 200) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "100px auto 100px auto" }}>
      <Title>Комментарии</Title>
      {session ? (
        <Form onFinish={sendComment}>
          <Form.Item label="Имя">
            <Input
              placeholder="Введите имя"
              disabled
              defaultValue={session.user?.email}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="Сообщение"
            required
            rules={[
              { required: true, message: "Введите сообщение" },
              {
                max: 500,
                min: 10,
                message: "Сообщение должно быть от 10 до 500 символов",
              },
            ]}
          >
            <TextArea
              rows={4}
              minLength={10}
              maxLength={500}
              placeholder="Введите сообщение"
              allowClear={true}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Отправить
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Text>Войдите, чтобы оставить комментарий</Text>
      )}
      {comments.length > 0
        ? comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Avatar
                    style={{ backgroundColor: "#87d068", marginRight: "10px" }}
                    icon={<UserOutlined />}
                  />
                  <Text>{comment.user.email}</Text>
                </div>
                <Text>{comment.content}</Text>
              </div>
              <div>
                <Text>{comment.createdAt.toString().split("T")[0]}</Text>
                {session && session.user.id === comment.user.id ? (
                  <DeleteOutlined
                    onClick={() => deleteCommentHandler(comment.id)}
                    style={{
                      color: "red",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  />
                ) : null}
              </div>
            </div>
          ))
        : null}
    </div>
  );
}
