import React, { useState, useEffect } from "react";
// react component that copies the given text inside your clipboard
// reactstrap components
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Spinner,
  Button,
} from "reactstrap";
import axios from "axios";
import moment from "moment";
// core components
import Header from "components/Headers/Header.js";
import { Link } from "react-router-dom";
const Document = (props) => {
  const [state, setState] = useState(null);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    axios
      .post("/api/document/find", { id: props.match.params.id })
      .then((res) => {
        setState(res.data.result);
      });
  }, [props.match.params.id]);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col className="mb-5 mb-xl-0" xl="6">
            <Card className="card-profile shadow">
              {state ? (
                <CardBody>
                  <div className="h3">User info</div>
                  <div className="doc-user-info">
                    <img
                      src={require("assets/img/theme/team-1-800x800.jpg")}
                      alt={state.user.name}
                      className="has-avatar"
                    />
                    <div className="info p-3">
                      <Link to={`/admin/user/${state.user._id}`}>
                        <span>
                          {state.user.name}
                          <span className="username">
                            {" "}
                            ({state.user.username})
                          </span>
                        </span>
                      </Link>
                      <div>
                        <a href={"mailto:" + state.user.email}>
                          {state.user.email}
                        </a>
                        {state.user.phone ? (
                          <>
                            <span> • </span>
                            <a
                              href={"tel:" + state.user.phone}
                              className="user-phone"
                            >
                              {state.user.phone}
                            </a>
                          </>
                        ) : null}
                      </div>
                      <div>
                        <span className="user-phone">
                          Joined {moment(state.user.created).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="h3">Verification attachment</div>
                  <Row>
                    <Col>attachment front</Col>
                    <Col>attachment back</Col>
                  </Row>
                  <div
                    className={`d-flex justify-content-${
                      state.document.status !== "verified"
                        ? "between"
                        : "center"
                    } mt-5`}
                  >
                    <Button
                      className="mr-4"
                      color="error"
                      size="md"
                      disabled={disabled}
                      onClick={() => {
                        setDisabled(true);
                        axios
                          .get("/api/document/decline/" + state.document._id)
                          .then((res) => {
                            if (res.data.status) window.location.reload();
                            else console.log("some thing went wrong");
                          });
                      }}
                    >
                      Decline, Remove Document
                    </Button>
                    {state.document.status !== "verified" ? (
                      <Button
                        className="mr-4"
                        color="info"
                        size="md"
                        disabled={disabled}
                        onClick={() => {
                          setDisabled(true);
                          axios
                            .get("/api/document/approve/" + state.document._id)
                            .then((res) => {
                              if (res.data.status) window.location.reload();
                              else console.log("some thing went wrong");
                            });
                        }}
                      >
                        Confirm
                      </Button>
                    ) : null}
                  </div>
                </CardBody>
              ) : (
                <div className="text-center mt-4 mb-4">
                  <Spinner animation="border" variant="secondary" />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Document;
