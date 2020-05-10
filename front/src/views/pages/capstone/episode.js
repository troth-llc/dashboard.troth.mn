import React, { useState, useEffect, useRef } from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
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
const Episode = (props) => {
  const [state, setState] = useState(null);
  const [disabled, disable] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [episode, setEpisode] = useState({});
  const previewInput = useRef(null);
  const [preview, setPreview] = useState(null);
  const [errorCover, setErrorCover] = useState(null);
  const toggle = () => setModal(!modal);
  const get = (id) => {
    setState(null);
    axios.get("/api/episode/" + id).then((res) => {
      res.data.status
        ? setState(res.data.result)
        : (window.location.href = "/admin/capstone/course");
    });
  };
  useEffect(() => {
    get(props.match.params.id);
  }, []);
  useEffect(() => {}, [modal, episode.cover]);
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
                  Episodes
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
                          .post("/api/episode/search", {
                            search: search.trim(),
                          })
                          .then((res) => setState(res.data.result));
                      }
                    }
                  }}
                >
                  <Button
                    color="info"
                    type="button"
                    className="mr-3"
                    onClick={() => {
                      setEpisode({});
                      setModal(true);
                    }}
                  >
                    Add Episode
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
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Free</th>
                                <th scope="col">Updated</th>
                                <th scope="col">Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.map((state, index) => {
                                return (
                                  <tr
                                    key={state._id}
                                    className={index === 0 ? "first-row" : null}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setError(null);
                                      toggle();
                                    }}
                                  >
                                    <th scope="row">{index + 1}</th>
                                    <th scope="row">{state.name}</th>
                                    <th scope="row">
                                      {state.description.substring(0, 50)}
                                    </th>
                                    <th scope="row">
                                      <span>{state.free ? "Yes" : "No"}</span>
                                    </th>
                                    <th scope="row">
                                      {moment(state.updated).fromNow()}
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
                            No Episode found
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
            upload.append("name", episode.name);
            upload.append("description", episode.description);
            upload.append("link", episode.link);
            upload.append("free", episode.free ? episode.free : false);
            upload.append("id", props.match.params.id);
            if (episode._id) upload.append("id", episode._id);
            axios({
              method: "post",
              url: `/api/episode/${episode._id ? "update" : "create"}`,
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
              {episode._id ? "Edit" : "Create"} Episode
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
                    <label className="form-control-label">Title</label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={episode.name}
                      autoFocus={true}
                      placeholder="Name"
                      name="name"
                      type="text"
                      required
                      onChange={(e) =>
                        setEpisode({
                          ...episode,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup>
                    <label className="form-control-label">
                      Video Link (Youtube, Vimeo)
                    </label>
                    <Input
                      className="form-control-alternative"
                      defaultValue={episode.url}
                      autoFocus={true}
                      placeholder="Link"
                      name="link"
                      type="url"
                      required
                      onChange={(e) =>
                        setEpisode({
                          ...episode,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup
                    className={episode.cover || preview ? "d-none" : "d-block"}
                  >
                    <label className="form-control-label">Poster image</label>
                    <input
                      type="file"
                      name="file"
                      ref={previewInput}
                      required={episode.cover ? false : true}
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
                      episode.cover || preview ? " d-block" : " d-none"
                    }`}
                  >
                    <img
                      src={episode.cover ? episode.cover : preview}
                      className="w-100"
                      alt="episode cover preview"
                    />
                    <button
                      className="btn btn-link pl-0"
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (episode._id && episode.cover) {
                          disable(true);
                          var filename = episode.cover.split("/").pop();
                          axios
                            .get("/api/course/course_remove_image/" + filename)
                            .then((result) => {
                              if (result.status) {
                                setEpisode({ ...episode, cover: null });
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
                      defaultValue={episode.description}
                      required
                      rows="8"
                      maxLength="10000"
                      onChange={(e) =>
                        setEpisode({
                          ...episode,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="free-episode"
                      name="free"
                      defaultChecked={episode.free}
                      onChange={(e) =>
                        setEpisode({
                          ...episode,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="free-episode"
                    >
                      Free episode
                    </label>
                  </div>
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
export default Episode;
