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
  DropdownMenu,
  DropdownToggle,
  Badge,
  UncontrolledDropdown,
  Modal,
  FormGroup,
  Input,
  ModalBody,
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
  const [modal, openmodal] = useState(false);
  const [category, setcategory] = useState({});
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
              <CardHeader className="bg-transparent d-flex justify-content-between">
                <h3 className="mb-0" style={{ lineHeight: "50px" }}>
                  Capstone Course Categories
                </h3>

                <Button
                  color="info"
                  className="mr-3"
                  onClick={() => {
                    setcategory({});
                    openmodal(true);
                  }}
                >
                  Add category
                </Button>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="table-data">
                    {state ? (
                      <Row>
                        {state.map((state, index) => {
                          return (
                            <Col sm={6} lg={3} md={6} xl={3} key={index}>
                              <Card className="course-card">
                                <CardImg
                                  top
                                  width="100%"
                                  src={state.cover}
                                  alt={state.name}
                                />
                                <UncontrolledDropdown>
                                  <DropdownToggle
                                    className="btn-icon-only"
                                    role="button"
                                    size="sm"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <i className="fas fa-ellipsis-v" />
                                  </DropdownToggle>
                                  <DropdownMenu
                                    className="dropdown-menu-arrow"
                                    right
                                  >
                                    <a
                                      href="#edit"
                                      className="dropdown-item"
                                      onClick={(e) => {
                                        openmodal(true);
                                        e.preventDefault();
                                      }}
                                    >
                                      Edit
                                    </a>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                                <CardBody>
                                  <Link to={`/${index}`}>
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
                                  </Link>
                                </CardBody>
                              </Card>
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
      <Modal isOpen={modal} centered>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // setDisabled(true);
            // axios
            //   .post("/api//create", {
            //     ...save,
            //   })
            //   .then((res) => {
            //     res.data.status
            //       ? window.location.reload()
            //       : setError(res.data.errors);
            //     // setDisabled(false);
            //   });
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Create category</h5>
          </div>
          <ModalBody>
            <Row>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label">Name</label>
                  <Input
                    className="form-control-alternative"
                    defaultValue={category.name}
                    autoFocus={true}
                    placeholder="Name"
                    name="name"
                    type="text"
                    required
                    onChange={(e) =>
                      setcategory({
                        ...category,
                        [e.target.name]: [e.target.value],
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
        </form>
      </Modal>
    </>
  );
};
export default Course;
