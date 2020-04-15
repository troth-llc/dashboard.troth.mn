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
import { Modal, ModalBody, ModalFooter } from "reactstrap";

import axios from "axios";
import moment from "moment";
// core components
import Header from "components/Headers/Header.js";
import { Link, Redirect } from "react-router-dom";
const Document = (props) => {
  const [state, setState] = useState(null);
  const [reason, setReason] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

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
                      onClick={toggle}
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
      <Modal isOpen={modal} centered>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDisabled(true);
            axios
              .post("/api/document/decline", {
                id: state.document._id,
                reason,
              })
              .then((res) => {
                if (res.data.status) {
                  return <Redirect to="/admin/verify" />;
                } else console.log("some thing went wrong");
              });
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Decline</h5>
          </div>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="reason">Enter reason to decline</label>
              <textarea
                className="form-control"
                id="reason"
                rows="3"
                required
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={disabled}>
              Decline
            </Button>
            <Button color="secondary" onClick={toggle} disabled={disabled}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
export default Document;
