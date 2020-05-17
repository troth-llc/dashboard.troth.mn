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
const Users = () => {
  const [users, setUsers] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [edit, setEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [save, setSave] = useState({ gender: "male", type: "member" });
  const toggle = () => setModal(!modal);
  const toggle_add = () => setAdd(!add);
  const get = () => {
    setUsers(null);
    axios.get("/api/users").then((res) => setUsers(res.data.user));
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
            <Card className="shadow">
              <CardHeader className="bg-transparent d-flex">
                <h3 className="mb-0" style={{ lineHeight: "50px" }}>
                  Users
                </h3>
                <Form
                  className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (search.trim()) {
                      setUsers(null);
                      axios
                        .post("/api/users/search", { search: search.trim() })
                        .then((res) => setUsers(res.data.result));
                    }
                  }}
                >
                  <Button
                    color="info"
                    type="button"
                    className="mr-3"
                    onClick={toggle_add}
                  >
                    Add user
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
                    {users ? (
                      <Table
                        className="align-items-center table-flush"
                        responsive
                        hover
                      >
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Username</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Email</th>
                            <th scope="col">Type</th>
                            <th scope="col">Joined</th>
                            <th scope="col" />
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => {
                            return (
                              <tr key={user._id}>
                                <th scope="row">
                                  <span className="mb-0 text-sm">
                                    <Link to={`/admin/user/${user._id}`}>
                                      {user.name}
                                    </Link>
                                  </span>
                                </th>
                                <th scope="row">@{user.username}</th>
                                <th scope="row">
                                  {user.phone ? user.phone : "N/A"}
                                </th>
                                <th scope="row">{user.email}</th>
                                <th scope="row">
                                  <span>{user.type}</span>
                                </th>
                                <th scope="row">
                                  <span>{moment(user.created).fromNow()}</span>
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
                                        to={`/admin/user/${user._id}`}
                                        className="dropdown-item"
                                      >
                                        View
                                      </Link>
                                      <DropdownItem
                                        onClick={() => {
                                          setEdit(null);
                                          setError(null);
                                          toggle();
                                          axios
                                            .post("/api/users/find", {
                                              id: user._id,
                                            })
                                            .then((res) =>
                                              setEdit(res.data.user)
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
                                        Disable
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
        {edit ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDisabled(true);
              axios
                .post("/api/users/update", {
                  ...edit,
                })
                .then((res) => {
                  res.data.status
                    ? window.location.reload()
                    : setError(res.data.errors);
                });
              setDisabled(false);
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title">User info</h5>
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
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label">Name</label>
                      <Input
                        className="form-control-alternative"
                        defaultValue={edit.name}
                        autoFocus={true}
                        placeholder="Name"
                        name="name"
                        type="text"
                        required
                        onChange={(e) =>
                          setEdit({ ...edit, [e.target.name]: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label">Username</label>
                      <Input
                        className="form-control-alternative"
                        defaultValue={edit.username}
                        placeholder="Username"
                        onChange={(e) =>
                          setEdit({ ...edit, [e.target.name]: e.target.value })
                        }
                        type="text"
                        name="username"
                        pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label">Email</label>
                      <Input
                        className="form-control-alternative"
                        defaultValue={edit.email}
                        placeholder="Email"
                        onChange={(e) =>
                          setEdit({ ...edit, [e.target.name]: e.target.value })
                        }
                        name="email"
                        type="email"
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label">Phone</label>
                      <Input
                        className="form-control-alternative"
                        defaultValue={edit.phone}
                        placeholder="Phone"
                        onChange={(e) =>
                          setEdit({ ...edit, [e.target.name]: e.target.value })
                        }
                        name="phone"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <label className="form-control-label">Website</label>
                      <Input
                        className="form-control-alternative"
                        defaultValue={edit.website}
                        placeholder="Website"
                        onChange={(e) =>
                          setEdit({ ...edit, [e.target.name]: e.target.value })
                        }
                        name="website"
                        type="url"
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <label>About</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="about"
                        onChange={(e) =>
                          setEdit({ ...edit, [e.target.name]: e.target.value })
                        }
                      ></textarea>
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <Label for="type">User type</Label>
                      <Input
                        type="select"
                        name="type"
                        id="type"
                        value={edit.type}
                        required
                        onChange={(e) =>
                          setEdit({ ...edit, [e.target.name]: e.target.value })
                        }
                      >
                        <option value="member">Member</option>
                        <option value="premium">Premium Member</option>
                        <option value="partner">Partner</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" disabled={disabled}>
                Save
              </Button>
              <Button color="secondary" onClick={toggle} disabled={disabled}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        ) : (
          <div className="text-center p-3">
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
      </Modal>
      <Modal isOpen={add} centered>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDisabled(true);
            axios
              .post("/api/users/create", {
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
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label">Name</label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={save.name}
                      autoFocus={true}
                      placeholder="Name"
                      name="name"
                      type="text"
                      required
                      onChange={(e) =>
                        setSave({ ...save, [e.target.name]: e.target.value })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label">Username</label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={save.username}
                      placeholder="Username"
                      onChange={(e) =>
                        setSave({ ...save, [e.target.name]: e.target.value })
                      }
                      type="text"
                      name="username"
                      pattern="^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label">Email</label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={save.email}
                      placeholder="Email"
                      onChange={(e) =>
                        setSave({ ...save, [e.target.name]: e.target.value })
                      }
                      name="email"
                      type="email"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <label className="form-control-label">Phone</label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={save.phone}
                      placeholder="Phone"
                      onChange={(e) =>
                        setSave({ ...save, [e.target.name]: e.target.value })
                      }
                      name="phone"
                      type="text"
                    />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup>
                    <label className="form-control-label">Website</label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={save.website}
                      placeholder="Website"
                      onChange={(e) =>
                        setSave({ ...save, [e.target.name]: e.target.value })
                      }
                      name="website"
                      type="url"
                    />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup>
                    <label>About</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="about"
                      onChange={(e) =>
                        setSave({ ...save, [e.target.name]: e.target.value })
                      }
                    ></textarea>
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup>
                    <Label for="type">User type</Label>
                    <Input
                      type="select"
                      name="type"
                      id="type"
                      value={save.type}
                      required
                      onChange={(e) =>
                        setSave({ ...save, [e.target.name]: e.target.value })
                      }
                    >
                      <option value="member">Member</option>
                      <option value="premium">Premium Member</option>
                      <option value="partner">Partner</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={disabled}>
              Save
            </Button>
            <Button color="secondary" onClick={toggle_add} disabled={disabled}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};
export default Users;
