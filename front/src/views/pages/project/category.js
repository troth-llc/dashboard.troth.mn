import React, { useEffect, useState } from "react";
import {
  Row,
  Card,
  CardHeader,
  Container,
  CardBody,
  Col,
  Spinner,
  Button,
  Modal,
  ModalBody,
  Input,
  FormGroup,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import moment from "moment";
import "./style.scss";
const ProjectCategory = () => {
  const [state, setState] = useState(null);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [disabled, disable] = useState(false);
  const [category, setCategory] = useState({});
  const [error, setError] = useState();
  useEffect(() => {
    const get = () => {
      axios
        .get("/api/project/category")
        .then((result) => setState(result.data.result));
    };
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
              <CardHeader className="bg-transparent d-flex justify-content-between">
                <h3 className="mb-0" style={{ lineHeight: "50px" }}>
                  Project Category
                </h3>
                <Button
                  color="info"
                  type="button"
                  className="mr-3"
                  onClick={() => {
                    setCategory({});
                    setModal(true);
                  }}
                >
                  Add Category
                </Button>
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
                                <th scope="col">Name</th>
                                <th scope="col">Projects</th>
                                <th scope="col">Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.map((state, index) => {
                                return (
                                  <tr
                                    key={state._id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setModal(true);
                                      axios
                                        .get(
                                          "/api/project/category/" + state._id
                                        )
                                        .then((result) =>
                                          result.data.result
                                            ? setCategory({
                                                ...result.data.result,
                                              })
                                            : alert("some thing went wrong")
                                        );
                                    }}
                                  >
                                    <th scope="row">{index + 1}</th>
                                    <th scope="row">{state.name}</th>
                                    <th scope="row">
                                      <span>0</span>
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
                            Categories not found{" "}
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
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalBody className="pb-0">
          <Row>
            <Col>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  disable(true);
                  axios
                    .post(
                      `/api/project/category/${
                        category._id ? "update" : "create"
                      }`,
                      {
                        name: category.name,
                        id: category._id ? category._id : "",
                      }
                    )
                    .then((res) =>
                      res.data.status
                        ? window.location.reload()
                        : setError("Invalid name")
                    );
                  disable(false);
                }}
              >
                <FormGroup>
                  <label className="form-control-label">Category Name</label>
                  <Input
                    className="form-control-alternative"
                    defaultValue={category.name}
                    autoFocus={true}
                    placeholder="Name"
                    name="name"
                    type="text"
                    required
                    disabled={disabled}
                    defaultValue={category.name}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  <span className="text-danger error-text">{error}</span>
                  {category._id ? (
                    <button
                      type="button"
                      className="btn btn-link text-danger float-right"
                      onClick={() => {
                        axios
                          .get(`/api/project/category/remove/${category._id}`)
                          .then((res) =>
                            res.data.status
                              ? window.location.reload()
                              : setError("some thing went wrong")
                          );
                      }}
                    >
                      Remove?
                    </button>
                  ) : null}
                </FormGroup>
              </form>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ProjectCategory;
