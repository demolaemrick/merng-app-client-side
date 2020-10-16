import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

const Register = (props) => {
  const [errors, setErrors] = useState({});
  
  const context = useContext(AuthContext);

  const { changeHandler, submitHandler, values } = useForm(registeUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { login: userData } }) { 
      //   console.log(result);
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registeUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form
        className={loading ? "loading" : ""}
        onSubmit={submitHandler}
        noValidate
      >
        <h1>Register page</h1>
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
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
          type="email"
          onChange={changeHandler}
          error={errors.email ? true : false}
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
        <Form.Input
          label="ConfirmPassword"
          placeholder="ConfirmPassword..."
          name="confirmPassword"
          value={values.confirmPassword}
          type="password"
          onChange={changeHandler}
          error={errors.confirmPassword ? true : false}
        />
        <Button type="submit" primary>
          Register
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
    </div>
  );
};

export default Register;
