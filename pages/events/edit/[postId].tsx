import { useFormik } from "formik";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type PropsType = { appUrl: string };
type ErrorResponse = {
  status: string;
};
type PostType = {
  id: number;
  author_id: number;
  title: string;
  geo: string;
  event_time: Date;
  category: string;
  description: string;
  is_public: boolean;
};

export default function EditPost({ appUrl }: PropsType) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const postId = router.query.postId;
      if (!postId) {
        return;
      }
      try {
        const res = await axios.get(`${appUrl}/api/posts/getPost`, {
          params: { postId },
        });
        console.log("response - " + res);
      } catch (err) {
        const error = err as AxiosError;
        const response = error.response;
        setErrorMessage((response?.data as ErrorResponse).status);
      }
    })();
  }, [appUrl, router]);

  return (
    <div className="defaultPage">
      <form
      // className={styles.block} onSubmit={formik.handleSubmit}
      >
        <div>Edit Post</div>
        <div>
          <input
            name="title"
            placeholder="title"
            // onChange={}
            value={""}
          />
          <input
            name="description"
            placeholder="description"
            // onChange={formik.handleChange}
            value={""}
          />
          <select
            name="category"
            // onChange={formik.handleChange}
            value={""}
          >
            <option value="social">Social</option>
            <option value="volunteer">Volunteer</option>
            <option value="professional">Proffesional</option>
            <option value="campaigns">Сampaigns</option>
          </select>
        </div>
      </form>
    </div>
  );
}
