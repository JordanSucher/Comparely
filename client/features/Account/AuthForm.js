import React, { useState } from "react";
import CreateAccountForm from "./CreateAccountForm";
import Login from "./Login";
import { Container } from "react-bootstrap";

const AuthForm = () => {
  const [form, setForm] = useState(true);

  return (
    <Container>
      {form ? (
        <Login
          name="login"
          displayName="Login"
          setForm={setForm}
          />
      ) : (
        <CreateAccountForm
          name="create-account"
          displayName="Create Account"
          setForm={setForm}
        />
      )}
    </Container>
  );
};

export default AuthForm;
