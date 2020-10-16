import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";


import { FETCH_POSTS_QUERY } from "../util/graphql";

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }

      commentCount
    }
  }
`;
const PostForm = () => {
  const [error, setError] = useState("");

  const { values, changeHandler, submitHandler } = useForm(createPostCallback, {
    body: "",
  });
  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });

      values.body = "";
    },
    onError(err) {
      setError(err.graphQLErrors[0].message);
    },
  });

  function createPostCallback() {
    createPost();
  }
  return (
    <>
      <Form onSubmit={submitHandler}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World"
            name="body"
            onChange={changeHandler}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error}</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default PostForm;
