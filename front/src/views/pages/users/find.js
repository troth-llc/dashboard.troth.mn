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
} from "reactstrap";
import axios from "axios";
import moment from "moment";
// core components
import Header from "components/Headers/Header.js";

const User = (props) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios
      .post("/api/users/find", { id: props.match.params.id })
      .then((res) => setUser(res.data.user));
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
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={user.avatar}
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
                            <span className="heading">{user.projects}</span>
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
              <CardBody></CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default User;
