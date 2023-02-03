import axios from "axios";
import {useFormik} from "formik";
import {useSession} from "next-auth/react";
import styles from "../PostPage/LivePost/LivePost.module.scss";
import Image from "next/image";
import { Button, Form, Input } from "antd";

const { TextArea } = Input;

type PropsType = {
  isThreadExists: boolean;
  appUrl: string;
  postId: number;
  isAuthor: boolean | undefined;
  threadId?: string;
};

export default function ThreadForm({
  isThreadExists,
  appUrl,
  threadId,
  postId,
}: PropsType) {
  const { data: session } = useSession();

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: async (values) => {
      await axios.post(
        `${appUrl}/api/threads/reply`,
        {message: values.message},
        {params: {threadId, postId}}
      );
    },
  });

  if (!threadId && !postId) {
    return null;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Form.Item
        className={styles.descriptionText}
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
          onChange={formik.handleChange}
          size={"small"}
          className={styles.descriptionTextarea}
        />
      </Form.Item>
      <Button
        className={styles.replyBtn}
        htmlType="submit"
      >
        <Image
          src="/decor/arrow2.svg"
          alt=""
          width={14}
          height={10}
          className={styles.reply}
        />
        <span className={styles.replyBtnText}>Reply</span>
      </Button>
    </form>
  );
}
