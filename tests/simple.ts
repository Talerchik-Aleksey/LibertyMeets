import type { NextApiRequest, NextApiResponse } from "next";
import { isAssetError } from "next/dist/client/route-loader";
import { getPost } from "../services/posts";
import { handleReplyToPost } from "../services/reply";
import { connect } from "../utils/db";

connect();

xdescribe("Simple test", () => {
  it("foo", async () => {

    // postId = 9 
    // userId= 4 -- author vburdylev@twelvedevs.com
    // userId = 3 -- stranger vadim.burdylev@mail.ru

    const postId = 9;
    const userIdStranger = 3;

    const post = await getPost(postId);
    const result = await handleReplyToPost(userIdStranger, post!, 'hello world');

    expect(result).toBeTruthy();
  });
});