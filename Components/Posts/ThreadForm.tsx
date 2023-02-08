import axios from "axios";
import styles from "../PostPage/LivePost/LivePost.module.scss";
import Image from "next/image";
import { Button, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const { TextArea } = Input;

type PropsType = {
  isThreadExists: boolean;
  appUrl: string;
  postId: number;
  isAuthor: boolean | undefined;
  threadId?: string;
};

export default function ThreadForm({ appUrl, threadId, postId }: PropsType) {
  const [form] = Form.useForm();
  const [isVisibleForm, setIsVisibleForm] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  const { success, error } = Modal;

  const showModalSuccess = (text: string) => {
    success({
      content: text,
      okText: "Ok",
      onOk() {
        setIsVisibleForm(false);
      },
    });
  };

  const showModalError = (text: string) => {
    error({
      content: text,
      okText: "Ok",
      onOk() {
        setIsVisibleForm(false);
      },
    });
  };

  function openForm() {
    if (session) {
      setIsVisibleForm(true);
      return;
    }
    router.push("/signin");
  }

  async function handleSubmit(values: any) {
    const res = await axios.post(
      `${appUrl}/api/threads/reply`,
      { message: values.message },
      { params: { threadId, postId } }
    );

    if (res.status === 200) {
      showModalSuccess(
        "We sent your message to the host. Receive responses and continue chatting over email."
      );
      form.setFieldsValue({
        message: "",
      });
      return;
    }
    showModalError(
      "Sorry, your reply was not sent. Please try again later or contact support for assistance."
    );
    form.setFieldsValue({
      message: "",
    });
  }

  if (!threadId && !postId) {
    return null;
  }

  return (
    <>
      {isVisibleForm ? (
        <Form
          onFinish={handleSubmit}
          form={form}
          className={styles.messageForm}
        >
          <Form.Item
            className={styles.textboxArea}
            labelAlign={"left"}
            labelCol={{ span: 2 }}
            name="message"
            colon={false}
            initialValue={""}
            rules={[{ required: false }, { type: "string", max: 200 }]}
          >
            <TextArea
              maxLength={200}
              autoSize={{ minRows: 7, maxRows: 7 }}
              showCount={true}
              rows={7}
              size={"small"}
              className={styles.descriptionTextarea}
            />
          </Form.Item>
          <Button className={styles.replyBtn} htmlType="submit">
            <Image
              src="/decor/arrow2.svg"
              alt=""
              width={14}
              height={10}
              className={styles.reply}
            />
            <span className={styles.replyBtnText}>Reply</span>
          </Button>
        </Form>
      ) : (
        <Button className={styles.replyBtn} onClick={openForm}>
          <Image
            src="/decor/arrow2.svg"
            alt=""
            width={14}
            height={10}
            className={styles.reply}
          />
          <span className={styles.replyBtnText}>Reply</span>
        </Button>
      )}
    </>
  );
}
