import { Post } from "../types";

export const examplePost: Post = {
    uid: "1",
    slug: "example-post",
    title: "Example Post",
    content: "This is an example post",
    username: "johndoe",
    saveCount: 0,
};

export const examplePost2: Post = {
    uid: "2",
    slug: "example-post-2",
    title: "Example Post 2",
    content: "This is an example post 2",
    username: "janedoe",
    saveCount: 0,
};

export const examplePosts: Post[] = [examplePost, examplePost2];
