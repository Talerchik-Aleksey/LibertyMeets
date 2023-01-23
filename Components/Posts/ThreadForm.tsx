import axios from "axios";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";

type PropsType = {
  isThreadExists: boolean;
  appUrl: string;
  postId: number;
};

export default function ThreadForm({
  isThreadExists,
  appUrl,
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
        { message: values.message },
        { params: { postId, userId: session?.user.id } }
      );
    },
  });

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
