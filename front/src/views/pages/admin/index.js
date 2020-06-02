import React, { useState, useEffect, useContext } from "react";
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
  Badge,
} from "reactstrap";
// UwU
import { User } from "context/user";
import axios from "axios";
import moment from "moment";
// core components
import Header from "components/Headers/Header.js";
const Admins = () => {
  const [users, setUsers] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [edit, setEdit] = useState(null);
  const [modal, setModal] = useState(false);
  const [add, setAdd] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [save, setSave] = useState({ type: "admin" });
  const user = useContext(User);
  const toggle = () => setModal(!modal);
  const toggle_add = () => setAdd(!add);
  const get = () => {
    setUsers(null);
    axios.get("/api/admin").then((res) => setUsers(res.data.result));
  };
  useEffect(() => {
    get();
  }, []);
  return user ? (
    user.type === "root" ? (
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
                    Admins
                  </h3>
                  <Form
                    className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (search.trim()) {
                        setUsers(null);
                        axios
                          .post("/api/admin/search", {
                            search: search.trim(),
                          })
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
                      Add admin
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
                      {users && user ? (
                        <Table
                          className="align-items-center table-flush"
                          responsive
                          hover
                        >
                          <thead className="thead-light">
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Type</th>
                              <th scope="col">Joined</th>
                              <th scope="col" />
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((data) => {
                              return (
                                <tr key={data._id}>
                                  <th scope="row">
                                    {data.name}{" "}
                                    {data._id === user._id ? (
                                      <Badge color="success">You</Badge>
                                    ) : null}
                                  </th>
                                  <th scope="row">{data.email}</th>
                                  <th scope="row">{data.type}</th>
                                  <th scope="row">
                                    <span>
                                      {moment(data.created).fromNow()}
                                    </span>
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
                                        <DropdownItem
                                          onClick={() => {
                                            setEdit(null);
                                            setError(null);
                                            toggle();
                                            axios
                                              .post("/api/admin/find", {
                                                id: data._id,
                                              })
                                              .then((res) =>
                                                setEdit(res.data.result)
                                              );
                                          }}
                                        >
                                          Edit
                                        </DropdownItem>
                                        {data._id !== user._id ? (
                                          <DropdownItem
                                            href="#pablo"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              axios
                                                .get(
                                                  "/api/admin/remove/" +
                                                    data._id
                                                )
                                                .then((res) =>
                                                  res.data.status
                                                    ? window.location.reload()
                                                    : alert(
                                                        "some thing went wrong"
                                                      )
                                                );
                                            }}
                                            style={{ color: "red" }}
                                          >
                                            Remove
                                          </DropdownItem>
                                        ) : null}
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
                  .post("/api/admin/update", {
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
                <h5 className="modal-title">Admin info</h5>
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
                            setEdit({
                              ...edit,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">Email</label>
                        <Input
                          className="form-control-alternative"
                          defaultValue={edit.email}
                          placeholder="Email"
                          onChange={(e) =>
                            setEdit({
                              ...edit,
                              [e.target.name]: e.target.value,
                            })
                          }
                          name="email"
                          type="email"
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <Label for="type">Admin type</Label>
                        <Input
                          type="select"
                          name="type"
                          id="type"
                          value={edit.type}
                          required
                          onChange={(e) =>
                            setEdit({
                              ...edit,
                              [e.target.name]: e.target.value,
                            })
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="root">Root</option>
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
                .post("/api/admin/create", {
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
              <h5 className="modal-title">Create admin account</h5>
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
                          setSave({
                            ...save,
                            [e.target.name]: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label className="form-control-label">Email</label>
                      <Input
                        className="form-control-alternative"
                        defaultValue={save.email}
                        placeholder="Email"
                        onChange={(e) =>
                          setSave({
                            ...save,
                            [e.target.name]: e.target.value,
                          })
                        }
                        name="email"
                        type="email"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <Label for="type">Admin type</Label>
                      <Input
                        type="select"
                        name="type"
                        id="type"
                        value={save.type}
                        required
                        onChange={(e) =>
                          setSave({
                            ...save,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <option value="admin">admin</option>
                        <option value="root">root</option>
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
              <Button
                color="secondary"
                onClick={toggle_add}
                disabled={disabled}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </>
    ) : null
  ) : null;
};
export default Admins;
