import React, { useEffect, useState } from "react";
import {
  Row,
  Card,
  CardHeader,
  Container,
  CardBody,
  Col,
  Spinner,
  Modal,
  ModalBody,
  Tooltip,
  Button,
  FormGroup,
  Badge,
  Input,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import moment from "moment";
const Submission = () => {
  const [state, setState] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [modal, setModal] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [episode, setEpisode] = useState(null);
  // decline function
  const [decline, setDecline] = useState(null);
  const [disabled, disable] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  useEffect(() => {
    const get = () => {
      axios
        .get("/api/submission")
        .then((result) => setState(result.data.result));
    };
    get();
  }, []);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent d-flex">
                <h3 className="mb-0" style={{ lineHeight: "50px" }}>
                  User Submissions
                </h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="table-data">
                    {state ? (
                      <>
                        <div
                          className={`table-responsive ${
                            !state.length ? "d-none" : "block"
                          }`}
                        >
                          <table
                            className={
                              "align-items-center table-flush table table-hover"
                            }
                          >
                            <thead className="thead-light">
                              <tr>
                                <th scope="col">Ep. Name</th>
                                <th scope="col">User</th>
                                <th scope="col">Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.map((state) => {
                                return (
                                  <tr
                                    key={state._id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setSubmission(null);
                                      setModal(true);
                                      axios
                                        .get("/api/submission/" + state._id)
                                        .then((response) =>
                                          setSubmission(response.data.result)
                                        );
                                    }}
                                  >
                                    <th scope="row">{state.episode.name}</th>
                                    <th scope="row">{state.user.name}</th>
                                    <th scope="row">
                                      <span>
                                        {state.description.substring(0, 50)}
                                      </span>
                                    </th>
                                    <th scope="row">
                                      {state.status === "approved" ? (
                                        <Badge color="success">Approved</Badge>
                                      ) : (
                                        <Badge color="info">Pending</Badge>
                                      )}
                                    </th>
                                    <th scope="row">
                                      <span>
                                        {moment(state.created).fromNow()}
                                      </span>
                                    </th>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {!state.length ? (
                          <p className="text-center p-2 w-100 mb-0">
                            Submissions not found
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <div className="text-center">
                        <Spinner animation="border" variant="secondary" />
                      </div>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
      <Modal isOpen={modal} centered>
        {submission ? (
          <>
            <div className="modal-header pb-0">
              <h5 className="modal-title ">
                {submission.user.name}'s submission
              </h5>
            </div>
            <ModalBody className="submission-container">
              <div>
                <span
                  className="submission-episode"
                  id="episode-preview"
                  onMouseEnter={() => {
                    if (episode === null)
                      axios
                        .get("/api/episode/find/" + submission.episode._id)
                        .then((res) => setEpisode(res.data.result));
                  }}
                >
                  Episode: {submission.episode.name}{" "}
                  <div className="ni ni-bulb-61"></div>
                </span>
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen}
                  autohide={false}
                  className="episode-preview"
                  target="episode-preview"
                  fade={false}
                  toggle={toggle}
                >
                  {episode ? (
                    <div className="episode-container">
                      <div className="episode-cover">
                        <div
                          className="episode-image"
                          style={{ backgroundImage: `url(${episode.cover})` }}
                        />
                      </div>
                      <div className="d-flex justify-content-between">
                        <h4 className="tooltip-episode-name">
                          sasdasdaddddddddddddddddddddddd{episode.name}
                        </h4>
                        <span>{episode.duration}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="tooltip-preload">
                      <Spinner size="sm" color="secondary" />
                    </div>
                  )}
                </Tooltip>
              </div>
              <hr />
              <div className="description-scroller">
                <h4>{submission.description}</h4>
              </div>
              <hr />
              <a
                href={submission.file}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                Submission File
              </a>
              <div>
                {!decline ? (
                  <>
                    <div className="float-left">
                      {submission.status === "pending" ? (
                        <Button
                          color="link"
                          className="text-danger p-0 mt-2"
                          type="button"
                          onClick={() =>
                            setDecline(
                              "Таны илгээсэн даалгавар хангалтгүй байгаа тул энэ удаа даалгаврыг баталгаажуулахаас татгалзаж байна."
                            )
                          }
                        >
                          Decline
                        </Button>
                      ) : null}
                    </div>
                    <div className="float-right">
                      {submission.status === "pending" ? (
                        <Button
                          color="link"
                          className="text-primary p-0 mt-2"
                          type="button"
                          onClick={() => {
                            axios
                              .get("/api/submission/approve/" + submission._id)
                              .then((result) =>
                                result.data.status
                                  ? window.location.reload()
                                  : alert("some thing went wrong")
                              );
                          }}
                        >
                          Approve
                        </Button>
                      ) : null}
                      <Button
                        color="link"
                        className="text-muted p-0 mt-2 mr-2"
                        type="button"
                        onClick={() => setModal(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <FormGroup className="mb-0 pt-2">
                      <Input
                        type="textarea"
                        name="text"
                        autoFocus={true}
                        required
                        defaultValue={decline}
                        disabled={disabled}
                        onChange={(e) => {
                          setDecline(e.target.value);
                        }}
                      />
                    </FormGroup>
                    <div className="float-left">
                      <span className="fs-14 d-block text-danger mt-2">
                        This submission will permanently deleted
                      </span>
                    </div>
                    <div className="float-right">
                      <Button
                        color="link"
                        className="text-danger p-0 mt-2"
                        disabled={disabled}
                        onClick={() => {
                          disable(true);
                          axios
                            .post("/api/submission/remove", {
                              id: submission._id,
                              decline,
                            })
                            .then((response) =>
                              response.data.status
                                ? window.location.reload()
                                : alert("some thing went wrong")
                            );
                        }}
                      >
                        Okey
                      </Button>
                      <Button
                        color="link"
                        className="text-muted p-0 mt-2 mr-2"
                        disabled={disabled}
                        onClick={() => setDecline(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
          </>
        ) : (
          <div className="text-center w-100 p-3">
            <Spinner color="primary" size="sm" />
          </div>
        )}
      </Modal>
    </>
  );
};
export default Submission;
