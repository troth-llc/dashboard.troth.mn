import React, { useState, useEffect, useRef } from "react";
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
const Course = () => {
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  const [state, setState] = useState(null);
  const [disabled, disable] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState({});

  const previewInput = useRef(null);
  const [preview, setPreview] = useState(null);
  const [errorCover, setErrorCover] = useState(null);
  const [category, setCategory] = useState(null);
  const toggle = () => setModal(!modal);
  const get = ({ ...args }) => {
    if (args.category) {
      setState(null);
      axios
        .get("/api/course/course_category/" + args.category)
        .then((res) => setState(res.data.result));
    } else if (args.id) {
      setCourse({});
      axios
        .get("/api/course/find/" + args.id)
        .then((res) => setCourse(res.data.result));
    } else {
      setState(null);
      axios.get("/api/course").then((res) => setState(res.data.result));
    }
  };
  const get_category = () => {
    axios
      .get("/api/course/category")
      .then((res) => setCategory(res.data.result));
  };
  useEffect(() => {
    get_category();
    params.has("category") ? get({ category: params.get("category") }) : get();
  }, []);
  useEffect(() => {}, [modal, course.cover]);
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
                      e.preventDefault();
                      if (search.trim()) {
                        setState(null);
                        axios
                          .post("/api/course/search", { search: search.trim() })
                          .then((res) => setState(res.data.result));
                      }
                    }
                  }}
                >
                  {params.has("category") ? (
                    <Link
                      to="/admin/capstone/course"
                      className="mr-3"
                      onClick={get}
                    >
                      Show all
                    </Link>
                  ) : null}
                  <Button
                    color="info"
                    type="button"
                    className="mr-3"
                    onClick={() => {
                      setCourse({});
                      setModal(true);
                    }}
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
                              {state.map((state) => {
                                return (
                                  <tr key={state._id}>
                                    <th scope="row">
                                      <span className="mb-0 text-sm">
                                        <Link to={`/admin/user/${state._id}`}>
                                          {state.name}
                                        </Link>
                                      </span>
                                    </th>
                                    <th scope="row">
                                      {state.description.substring(0, 50)}
                                    </th>
                                    <th scope="row">
                                      <span>{state.category.name}</span>
                                    </th>
                                    <th scope="row">{state.episode.length}</th>
                                    <th scope="row">0</th>
                                    <th scope="row">
                                      <span>
                                        {moment(state.created).fromNow()}
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
                                          <Link
                                            to={`/admin/capstone/course/${state._id}`}
                                            className="dropdown-item"
                                          >
                                            View
                                          </Link>
                                          <DropdownItem
                                            onClick={() => {
                                              setError(null);
                                              get({ id: state._id });
                                              toggle();
                                            }}
                                          >
                                            Edit
                                          </DropdownItem>
                                          {state.episode.length === 0 ? (
                                            <DropdownItem
                                              href="#pablo"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                axios
                                                  .get(
                                                    "/api/course/remove/" +
                                                      state._id
                                                  )
                                                  .then((res) =>
                                                    res.data.status
                                                      ? get()
                                                      : alert(
                                                          "something went wrong"
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
                          </table>
                        </div>
                        {!state.length ? (
                          <p className="text-center p-2 w-100 mb-0">
                            No Course found
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            disable(true);
            const { current } = previewInput;
            const upload = new FormData();
            upload.append("file", current.files[0]);
            upload.append("name", course.name);
            upload.append("description", course.description);
            !course.category
              ? upload.append("category", category[0]._id)
              : upload.append("category", course.category);
            if (course._id) upload.append("id", course._id);
            axios({
              method: "post",
              url: `/api/course/${course._id ? "update" : "create"}`,
              headers: {
                "Content-Type": "multipart/form-data",
              },
              data: upload,
            }).then((res) => {
              res.data.status
                ? window.location.reload()
                : setError(res.data.errors);
              disable(false);
            });
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">
              {course._id ? "Edit" : "Create"} Course
            </h5>
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
                <Col lg="12">
                  <FormGroup>
                    <label className="form-control-label">Name</label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={course.name}
                      autoFocus={true}
                      placeholder="Name"
                      name="name"
                      type="text"
                      required
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup
                    className={course.cover || preview ? "d-none" : "d-block"}
                  >
                    <label className="form-control-label">Cover image</label>
                    <input
                      type="file"
                      name="file"
                      ref={previewInput}
                      required={course.cover ? false : true}
                      className="form-control-file"
                      accept="image/x-png,image/gif,image/jpeg"
                      onChange={(e) => {
                        setErrorCover(null);
                        var file = e.target.files[0];
                        var ext = file.name
                          .substring(file.name.lastIndexOf(".") + 1)
                          .toLowerCase();
                        if (
                          file &&
                          (ext === "png" || ext === "jpeg" || ext === "jpg")
                        ) {
                          var reader = new FileReader();
                          reader.onload = function (e) {
                            setPreview(e.target.result);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setErrorCover("invalid image");
                        }
                      }}
                    />
                    <span className="text-red mt-2">{errorCover}</span>
                  </FormGroup>
                  <div
                    className={`position-relative${
                      course.cover || preview ? " d-block" : " d-none"
                    }`}
                  >
                    <img
                      src={course.cover ? course.cover : preview}
                      className="w-100"
                      alt="course cover preview"
                    />
                    <button
                      className="btn btn-link pl-0"
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (course._id && course.cover) {
                          disable(true);
                          var filename = course.cover.split("/").pop();
                          axios
                            .get("/api/course/course_remove_image/" + filename)
                            .then((result) => {
                              if (result.status) {
                                setCourse({ ...course, cover: null });
                              }
                              disable(false);
                            });
                        } else {
                          setPreview(null);
                          previewInput.current.value = null;
                        }
                      }}
                    >
                      remove image
                    </button>
                  </div>
                </Col>
                <Col lg="12">
                  <FormGroup>
                    <label className="form-control-label">Description</label>
                    <textarea
                      className="form-control-alternative form-control"
                      type="textarea"
                      name="description"
                      placeholder="Description"
                      defaultValue={course.description}
                      required
                      rows="8"
                      maxLength="10000"
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="category-select"
                    >
                      Category
                    </label>
                    <Input
                      type="select"
                      name="category"
                      id="category-select"
                      value={course.category}
                      required
                      onChange={(e) =>
                        setCourse({
                          ...course,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      {category ? (
                        category.map((c) => {
                          return (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          );
                        })
                      ) : (
                        <option>loading...</option>
                      )}
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
