import React, { useState, useEffect, useRef } from "react";
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
  ModalFooter,
  Alert,
} from "reactstrap";
// UwU
import { Link } from "react-router-dom";
import axios from "axios";
// import moment from "moment";
// core components
import Header from "components/Headers/Header.js";
import "./style.scss";
const Category = () => {
  const [state, setState] = useState(null);
  const [modal, openmodal] = useState(false);
  const [category, setcategory] = useState({});
  const [disabled, disable] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errorCover, setErrorCover] = useState(null);
  const [error, setError] = useState(null);
  const previewInput = useRef(null);
  const get = (id) => {
    id
      ? axios
          .get("/api/course/find_category/" + id)
          .then((res) => setcategory(res.data.result))
      : axios
          .get("/api/course/category")
          .then((res) => setState(res.data.result));
  };
  useEffect(() => {
    get();
  }, []);
  useEffect(() => {}, [modal, category.cover]);
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
                        {state.map((state) => {
                          return (
                            <Col sm={6} lg={3} md={6} xl={3} key={state._id}>
                              <Card className="course-card">
                                {state.cover ? (
                                  <CardImg
                                    top
                                    width="100%"
                                    src={state.cover}
                                    alt={state.name}
                                  />
                                ) : null}
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
                                        setcategory({});
                                        get(state._id);
                                        e.preventDefault();
                                      }}
                                    >
                                      Edit
                                    </a>
                                  </DropdownMenu>
                                </UncontrolledDropdown>
                                <CardBody>
                                  <Link
                                    to={`/admin/capstone/course?category=${state._id}`}
                                  >
                                    <CardSubtitle>{state.name}</CardSubtitle>
                                    <CardText>{state.description}</CardText>
                                    <p className="mb-0">
                                      <Badge color="primary">
                                        {state.course} Courses
                                      </Badge>
                                    </p>
                                  </Link>
                                </CardBody>
                              </Card>
                            </Col>
                          );
                        })}
                        {!state.length ? (
                          <p className="text-center p-2 w-100 mb-0">
                            No category found
                          </p>
                        ) : null}
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
            disable(true);
            const { current } = previewInput;
            const upload = new FormData();
            upload.append("file", current.files[0]);
            upload.append("name", category.name);
            upload.append("description", category.description);
            if (category._id) upload.append("id", category._id);
            axios({
              method: "post",
              url: `/api/course/${
                category._id ? "edit_category" : "create_category"
              }`,
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
              {category._id ? "Edit" : "Create"} category
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
            <Row>
              <Col lg="12">
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
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col lg="12">
                <FormGroup
                  className={category.cover || preview ? "d-none" : "d-block"}
                >
                  <label className="form-control-label">Cover image</label>
                  <input
                    type="file"
                    name="file"
                    ref={previewInput}
                    required={category.cover ? false : true}
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
                    category.cover || preview ? " d-block" : " d-none"
                  }`}
                >
                  <img
                    src={category.cover ? category.cover : preview}
                    className="w-100"
                    alt="course category cover preview"
                  />
                  <button
                    className="btn btn-link pl-0"
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (category._id && category.cover) {
                        disable(true);
                        var filename = category.cover.split("/").pop();
                        axios
                          .get("/api/course/category_remove_image/" + filename)
                          .then((result) => {
                            if (result.status) {
                              setcategory({ ...category, cover: null });
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
                    className="form-control"
                    rows="3"
                    name="description"
                    placeholder="Description"
                    defaultValue={category.description}
                    required
                    onChange={(e) =>
                      setcategory({
                        ...category,
                        [e.target.name]: e.target.value,
                      })
                    }
                  ></textarea>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={disabled}>
              Save
            </Button>
            <Button
              color="secondary"
              onClick={() => openmodal(false)}
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
export default Category;
