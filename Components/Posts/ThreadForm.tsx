import axios from "axios";
import { useFormik } from "formik";

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
  console.log("threadId", threadId);
  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: async (values) => {
      await axios.post(
        `${appUrl}/api/threads/reply`,
        { message: values.message },
        { params: { threadId, postId } }
      );
    },
  });

  if (!threadId && !postId) {
    return <></>;
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          name="message"
          placeholder="message"
          onChange={formik.handleChange}
        ></textarea>
        <button type="submit">
          {isThreadExists ? "Send message" : "Start thread"}
        </button>
      </form>
    </>
  );
}
