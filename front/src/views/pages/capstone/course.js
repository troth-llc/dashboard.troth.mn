import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Spinner,
  Button,
  CardImg,
  CardSubtitle,
  CardText,
} from "reactstrap";
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  UncontrolledTooltip,
  Badge,
} from "reactstrap";
// UwU
import { Link } from "react-router-dom";
import axios from "axios";
// import moment from "moment";
// core components
import Header from "components/Headers/Header.js";
import "./style.scss";
const Course = () => {
  const [state, setState] = useState(null);
  const [search, setSearch] = useState("");
  const get = () => {
    setState(null);
    axios.get("/api/course").then((res) => setState(res.data.result));
  };
  useEffect(() => {
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
            <Card className=" shadow">
              <CardHeader className="bg-transparent d-flex">
                <h3 className="mb-0" style={{ lineHeight: "50px" }}>
                  Capstone Course Categories
                </h3>
                <Form
                  className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (search.trim()) {
                      setState(null);
                      axios
                        .post("/api/course/search", { search: search.trim() })
                        .then((res) => setState(res.data.result));
                    }
                  }}
                >
                  <Button
                    color="info"
                    type="button"
                    className="mr-3"
                    onClick={() => {
                      // setSearch("");
                    }}
                  >
                    Add category
                  </Button>
                  <FormGroup className="mb-0">
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-search text-muted" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Search"
                        type="text"
                        className="text-dark"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <UncontrolledTooltip placement="top" target="cancel">
                        Cancel search
                      </UncontrolledTooltip>
                      <InputGroupAddon
                        id="cancel"
                        addonType="append"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSearch("");
                          get();
                        }}
                      >
                        <InputGroupText>
                          <i className="fas fa-trash text-muted" />
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Form>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="table-data">
                    {state ? (
                      <Row>
                        {state.map((state, index) => {
                          return (
                            <Col sm={6} lg={3} md={6} xl={3} key={index}>
                              <Link to={`/${index}`} className="course-card">
                                <Card>
                                  <CardImg
                                    top
                                    width="100%"
                                    src={state.cover}
                                    alt={state.name}
                                  />
                                  <CardBody>
                                    <CardSubtitle>{state.name}</CardSubtitle>
                                    <CardText>{state.description}</CardText>
                                    <p>
                                      <Badge color="primary">
                                        {state.course} Course
                                      </Badge>
                                      <Badge color="success" className="ml-2">
                                        {state.teacher} Teacher
                                      </Badge>
                                    </p>
                                  </CardBody>
                                </Card>
                              </Link>
                            </Col>
                          );
                        })}
                      </Row>
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
    </>
  );
};
export default Course;
