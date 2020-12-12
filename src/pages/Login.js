import React, { useState, useContext } from "react";
import { Form, Button, Message, Icon } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { AuthContext } from '../context/auth'

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

const Login = (props) => {
  const [errors, setErrors] = useState({});
  const context = useContext(AuthContext)

  const { changeHandler, submitHandler, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData }}) {
    //   console.log(result.data.login);
      context.login(userData)
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form
        className={loading ? "loading" : ""}
        onSubmit={submitHandler}
        noValidate
      >
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          type="text"
          error={errors.username ? true : false}
          onChange={changeHandler}
        />

        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          type="password"
          onChange={changeHandler}
          error={errors.password ? true : false}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
      <Message warning>
        <Icon name="question" />
            Forgot password?
      </Message>
    </div>
  );
};

export default Login;
