import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const changeHandler = (event) => {
    const value = event.target.value;
    setValues({ ...values, [event.target.name]: value });
  };
  const submitHandler = (event) => {
    event.preventDefault();
    callback();
  };

  return {
    changeHandler,
    submitHandler,
    values,
  };
};
