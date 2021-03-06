import React, { useState, useEffect } from "react";
import signUpSchema from "../validation/signUpSchema";
import axios from "axios";
import * as yup from "yup";
import { useHistory } from "react-router";
import { TextField, Typography, Button } from "@material-ui/core";

const initialFormValues = {
  username: "",
  password: "",
  phone_number: "",
};

const initialFormErrors = {
  username: "",
  password: "",
  phone_number: "",
};
const initialUsers = [];

const initialDisabled = true;

const SignUpForm = () => {
  const [users, setUsers] = useState(initialUsers);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [disabled, setDisabled] = useState(initialDisabled);
  const { push } = useHistory();

  const postNewUser = (newUser) => {
    axios
      .post("https://watermyplants01.herokuapp.com/api/auth/register", newUser)
      .then((res) => {
        console.log(res.data);
        setUsers([res.data, ...users]);
        setFormValues(initialFormValues);
      })
      .catch((err) => {
        console.error(err);
        setFormValues(initialFormValues);
      });
  };
  const validate = (name, value) => {
    yup
      .reach(signUpSchema, name)
      .validate(value)
      .then(() => setFormErrors({ ...formErrors, [name]: "" }))
      .catch((err) => setFormErrors({ ...formErrors, [name]: err.errors[0] }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    validate(name, value);
    setFormValues({ ...formValues, [name]: value });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      username: formValues.username.trim(),
      phone_number: formValues.phone_number.trim(),
      password: formValues.password.trim(),
    };
    postNewUser(newUser);
    push("/login");
  };
  useEffect(() => {
    signUpSchema.isValid(formValues).then((valid) => setDisabled(!valid));
  }, [formValues]);

  return (
    <div className="hero-image">
      <div className="hero-text">
        <form className="text-form" onSubmit={formSubmit}>
          <Typography variant="h2" color="primary">
            Please enter your information
          </Typography>

          <div className="errors">
            <div>{formErrors.username}</div>
            <div>{formErrors.password}</div>
            <div>{formErrors.phone_number}</div>
          </div>

          <TextField
            name="username"
            variant="outlined"
            label="Username:"
            value={formValues.username}
            onChange={onChange}
            color="primary"
            focused
          />
          <TextField
            name="phone_number"
            type="tel"
            variant="outlined"
            label="Phone Number:"
            value={formValues.phone_number}
            onChange={onChange}
            color="primary"
            focused
          />
          <TextField
            name="password"
            type="password"
            variant="outlined"
            label="Password:"
            value={formValues.password}
            onChange={onChange}
            color="primary"
            focused
          />
          <Button
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={formSubmit}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
