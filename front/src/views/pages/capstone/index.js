import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Button,
  Label,
} from "reactstrap";
import {
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Alert,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  UncontrolledTooltip,
} from "reactstrap";
// UwU
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
// core components
import Header from "components/Headers/Header.js";
const Course = (props) => {
  const url = new URL(window.location);
  var params = new URLSearchParams(url.search);
  const [state, setState] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [save, setSave] = useState(null);
  const toggle = () => setModal(!modal);
  const get = ({ ...args }) => {
    console.log(args);
    if (args.category) {
      setState(null);
      axios
        .get("/api/course/category/" + args.category)
        .then((res) => setState(res.data.result));
    } else if (args.id) {
      console.log("editings course");
    } else {
      setState(null);
      axios.get("/api/course").then((res) => setState(res.data.result));
    }
  };
  useEffect(() => {
    params.has("category") ? get({ category: params.get("category") }) : get();
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
                  Courses
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
                    onClick={() => setModal(true)}
                  >
                    Add Course
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
                      <Table
                        className="align-items-center table-flush"
                        responsive
                        hover
                      >
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Category</th>
                            <th scope="col">Episode</th>
                            <th scope="col">Submissions</th>
                            <th scope="col">Created</th>
                            <th scope="col" />
                          </tr>
                        </thead>
                        <tbody>
                          {state.map((user) => {
                            return (
                              <tr key={state._id}>
                                <th scope="row">
                                  <span className="mb-0 text-sm">
                                    <Link to={`/admin/user/${state._id}`}>
                                      {state.name}
                                    </Link>
                                  </span>
                                </th>
                                <th scope="row">@{user.username}</th>
                                <th scope="row">{state.description}</th>
                                <th scope="row">
                                  <span>{state.category}</span>
                                </th>
                                <th scope="row">{state.episode}</th>
                                <th scope="row">{state.submission}</th>
                                <th scope="row">
                                  <span>{moment(state.created).fromNow()}</span>
                                </th>
                                <td className="text-right">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      className="btn-icon-only text-light"
                                      href="#pablo"
                                      role="button"
                                      size="sm"
                                      color=""
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      <i className="fas fa-ellipsis-v" />
                                    </DropdownToggle>
                                    <DropdownMenu
                                      className="dropdown-menu-arrow"
                                      right
                                    >
                                      <Link
                                        to={`/admin/user/${state._id}`}
                                        className="dropdown-item"
                                      >
                                        View
                                      </Link>
                                      <DropdownItem
                                        onClick={() => {
                                          setError(null);
                                          toggle();
                                          axios
                                            .post("/api/users/find", {
                                              id: state._id,
                                            })
                                            .then((res) =>
                                              setState(res.data.course)
                                            );
                                        }}
                                      >
                                        Edit
                                      </DropdownItem>
                                      <DropdownItem
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
                                        style={{ color: "red" }}
                                      >
                                        Remove
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
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
            setDisabled(true);
            axios
              .post("/api/crouse/create", {
                ...save,
              })
              .then((res) => {
                res.data.status
                  ? window.location.reload()
                  : setError(res.data.errors);
                setDisabled(false);
              });
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Create user account</h5>
          </div>
          <ModalBody>
            {error ? (
              <Alert color="danger">
                {error.map((err, index) => {
                  return (
                    <div key={index}>
                      {err.param}: {err.msg} <br />
                    </div>
                  );
                })}
              </Alert>
            ) : null}
            <div>
              <Row></Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={disabled}>
              Save
            </Button>
            <Button
              color="secondary"
              onClick={() => setModal(false)}
              disabled={disabled}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
export default Course;
