import React, { useState, useEffect } from "react";
// react component that copies the given text inside your clipboard
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Spinner,
  Progress,
} from "reactstrap";
import axios from "axios";
import moment from "moment";
// core components
import Header from "components/Headers/Header.js";

const User = (props) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);
  useEffect(() => {
    axios.post("/api/users/find", { id: props.match.params.id }).then((res) => {
      setUser(res.data.user);
      if (res.data.user)
        axios
          .get("/api/project/get/" + res.data.user.id)
          .then((res) => setProjects(res.data.result));
    });
  }, [props.match.params.id]);
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              {user ? (
                <>
                  <Row className="justify-content-center">
                    <Col className="order-lg-2" lg="3">
                      {user.avatar ? (
                        <div className="card-profile-image">
                          <div
                            className="rounded-circle dash-avatar"
                            style={{ backgroundImage: `url(${user.avatar})` }}
                          />
                        </div>
                      ) : (
                        <div className="card-profile-image">
                          <div className="user--username">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                  <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <Row>
                      <div className="col">
                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                          <div>
                            <span className="heading">{user.following}</span>
                            <span className="description">Following</span>
                          </div>
                          <div>
                            <span className="heading">{user.followers}</span>
                            <span className="description">Followers</span>
                          </div>
                          <div>
                            <span className="heading">
                              {projects ? projects.length : "-"}
                            </span>
                            <span className="description">Projects</span>
                          </div>
                        </div>
                      </div>
                    </Row>
                    <div className="text-center">
                      <h3>
                        {user.name}
                        <span className="font-weight-light">
                          {" "}
                          @{user.username}
                        </span>
                      </h3>
                      <div className="h5 font-weight-300">
                        <i className="ni location_pin mr-2" />
                        {user.member}
                      </div>
                      <div className="h5 mt-4">
                        <i className="ni business_briefcase-24 mr-2" />
                        Email: {user.email}
                        <br />
                        Phone:{user.phone ? user.phone : "N/A"}
                      </div>
                      <div className="h5">
                        Joined {moment(user.created).fromNow()}
                      </div>
                      <div>
                        {user.website ? (
                          <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {user.website}
                          </a>
                        ) : null}
                      </div>
                      <hr className="my-4" />
                      <p>{user.about}</p>
                    </div>
                  </CardBody>
                </>
              ) : (
                <div className="text-center m-5">
                  <Spinner animation="border" variant="secondary" />
                </div>
              )}
            </Card>
          </Col>
          <Col className="order-xl-2" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Projects</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {projects ? (
                  projects.map((project) => {
                    return (
                      <div className="project-item-landscape" key={project._id}>
                        <a
                          className="flex-row d-flex"
                          target="_blank"
                          href={"https://troth.mn/project/view/" + project._id}
                        >
                          <div className="cover-container">
                            <div
                              className="project-photo"
                              style={{
                                backgroundImage: `url(${project.cover})`,
                              }}
                            />
                          </div>
                          <div className="project-detail">
                            <div className="project-title">{project.title}</div>
                            <div className="project-progress">
                              <Progress
                                value={Math.round(
                                  (project.amount / project.funded) * 100
                                )}
                              />
                            </div>
                            <span className="progress-meter-heading">
                              ₮{" "}
                              {Number(
                                project.funded.toFixed(1)
                              ).toLocaleString()}{" "}
                              <span className="text-stat text-stat-title">
                                raised of ₮{" "}
                                {Number(
                                  project.amount.toFixed(1)
                                ).toLocaleString()}{" "}
                                goal
                              </span>
                            </span>
                          </div>
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-100 text-center">
                    <Spinner color="primary" />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default User;
