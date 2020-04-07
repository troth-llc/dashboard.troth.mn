import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
const Login = () => {
  useEffect(() => {
    if (localStorage.getItem("dashboard")) window.location.replace("/");
  }, []);
  const [login, setLogin] = useState({
    email: "",
    password: "",
    loading: false,
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            <Form
              role="form"
              onSubmit={(e) => {
                e.preventDefault();
                setLogin({ ...login, loading: true });
                setError({
                  email: "",
                  password: "",
                });
                const { email, password } = login;
                axios
                  .post("/api/auth", {
                    email,
                    password,
                  })
                  .then((response) => {
                    let errors = response.data.errors;
                    let { status, token } = response.data;
                    if (status) {
                      localStorage.setItem("dashboard", token);
                      window.location.reload();
                    } else {
                      errors.map((error) =>
                        setError({ [error.param]: error.msg })
                      );
                      setLogin({ ...login, loading: false });
                    }
                  });
              }}
            >
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>

                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={login.email}
                    required
                    onChange={(e) =>
                      setLogin({ ...login, [e.target.name]: e.target.value })
                    }
                  />
                </InputGroup>
                <span className="text-error">{error.email}</span>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={login.password}
                    required
                    onChange={(e) =>
                      setLogin({ ...login, [e.target.name]: e.target.value })
                    }
                  />
                </InputGroup>
                <span className="text-error">{error.password}</span>
              </FormGroup>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  disabled={login.loading}
                >
                  {login.loading ? "Loading..." : "Sign in"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#forget"
              disabled={login.loading}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
