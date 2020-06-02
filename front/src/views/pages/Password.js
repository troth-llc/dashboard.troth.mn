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
import { Link } from "react-router-dom";
const ResetPassword = (props) => {
  useEffect(() => {
    if (localStorage.getItem("dashboard")) window.location.replace("/");
  }, []);
  const [login, setLogin] = useState({
    password: "",
    confirm_password: "",
    loading: false,
  });
  const [error, setError] = useState({
    password: "",
    confirm_password: "",
    token: "",
  });
  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Reset Password</small>
            </div>
            <Form
              role="form"
              onSubmit={(e) => {
                e.preventDefault();
                setLogin({ ...login, loading: true });
                setError({
                  password: "",
                  confirm_password: "",
                  token: "",
                });
                const { password, confirm_password } = login;
                axios
                  .post("/api/admin/reset", {
                    password,
                    confirm_password,
                    token: props.match.params.id,
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
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    name="confirm_password"
                    value={login.confirm_password}
                    required
                    onChange={(e) =>
                      setLogin({ ...login, [e.target.name]: e.target.value })
                    }
                  />
                </InputGroup>
                <span className="text-error">{error.confirm_password}</span>
              </FormGroup>
              <span className="text-error">{error.token}</span>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  disabled={login.loading}
                >
                  {login.loading ? "Loading..." : "Next"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <Link
              to="/auth/login"
              className="text-light"
              disabled={login.loading}
            >
              <small>Sign in</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default ResetPassword;
