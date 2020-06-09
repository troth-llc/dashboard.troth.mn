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
  Label,
  Badge,
  Progress,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import "./style.scss";
const Projects = () => {
  const [state, setState] = useState(null);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [project, setProject] = useState(null);
  const [disabled, disable] = useState(false);
  const [reject, setReject] = useState(false);
  const [rejectText, setRejectText] = useState("");
  const [error, setError] = useState({});
  const json_to_html = (json) => {
    let articleHTML = "";
    json.blocks.map((obj) => {
      switch (obj.type) {
        case "paragraph":
          articleHTML += `<div class="ce-block">
                        <div class="ce-block__content">
                            <div class="ce-paragraph cdx-block">
                            <p>${obj.data.text}</p>
                            </div>
                        </div>
                        </div>\n`;
          break;
        case "image":
          articleHTML += `<div class="ce-block">
                        <div class="ce-block__content d-flex text-center flex-column">
                          
                                    <img src="${obj.data.file.url}" alt="${obj.data.caption}"/>
                                    <figcaption class="text-italic">
                                        ${obj.data.caption}
                                    </figcaption>
                               
                            
                        </div>
                        </div>\n`;
          break;
        case "header":
          articleHTML += `<div class="ce-block">
                            <div class="ce-block__content">
                                <div class="ce-paragraph cdx-block">
                                    <h${obj.data.level}>${obj.data.text}</h${obj.data.level}>
                                </div>
                            </div>
                        </div>\n`;
          break;
        case "raw":
          articleHTML += `<div class="ce-block">
                            <div class="ce-block__content">
                                <div class="ce-code">
                                    <code>${obj.data.html}</code>
                                </div>
                            </div>
                        </div>\n`;
          break;
        case "code":
          articleHTML += `<div class="ce-block">
                        <div class="ce-block__content">
                            <div class="ce-code">
                                <code>${obj.data.code}</code>
                            </div>
                        </div>
                        </div>\n`;
          break;
        case "list":
          if (obj.data.style === "unordered") {
            const list = obj.data.items.map((item) => {
              return `<li class="cdx-list__item">${item}</li>`;
            });
            articleHTML += `<div class="ce-block">
                                    <div class="ce-block__content">
                                        <div class="ce-paragraph cdx-block">
                                            <ul class="cdx-list--unordered">${list.join(
                                              ""
                                            )}</ul>
                                        </div>
                                    </div>
                                </div>\n`;
          } else {
            const list = obj.data.items.map((item) => {
              return `<li class="cdx-list__item">${item}</li>`;
            });
            articleHTML += `<div class="ce-block">
                                <div class="ce-block__content">
                                    <div class="ce-paragraph cdx-block">
                                        <ol class="cdx-list--ordered">${list}</ol>
                                    </div>
                                </div>
                            </div>\n`;
          }
          break;
        case "delimeter":
          articleHTML += `<div class="ce-block">
                            <div class="ce-block__content">
                                <div class="ce-delimiter cdx-block"></div>
                            </div>
                        </div>\n`;
          break;
        case "attaches":
          articleHTML += `<div class="ce-block">
                            <div class="ce-block__content">
                                <a href="${obj.data.file.url}">${obj.data.file.name}</a>
                            </div>
                        </div>\n`;
          break;
        case "embed":
          articleHTML += `<div class="ce-block">
                                <div class="ce-block__content">
                                    <iframe width="${obj.data.width}" 
                                            height="${obj.data.height}" 
                                            src="${obj.data.source}" 
                                            frameborder="0" 
                                            allow="accelerometer; 
                                            autoplay; 
                                            encrypted-media; 
                                            gyroscope; 
                                            picture-in-picture" 
                                            allowfullscreen>
                                            </iframe>
                                    <strong>${obj.data.caption}</strong>
                                </div>
                            </div>\n`;
          break;
        default:
          return "";
      }
    });
    return articleHTML;
  };
  useEffect(() => {
    axios.get("/api/project").then((result) => setState(result.data.result));
  }, []);
  useEffect(() => {}, [project]);
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
                <h3 className="mb-0">Projects</h3>
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
                                <th scope="col">Title</th>
                                <th scope="col">Owner</th>
                                <th scope="col">Category</th>
                                <th scope="col">Status</th>
                                <th scope="col">Updated</th>
                                <th scope="col">Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.map((state) => {
                                return (
                                  <tr
                                    key={state._id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setProject(null);
                                      setReject(false);
                                      setModal(true);
                                      axios
                                        .get("/api/project/" + state._id)
                                        .then((result) =>
                                          result.data.result
                                            ? setProject(result.data.result)
                                            : alert("some thing went wrong")
                                        );
                                    }}
                                  >
                                    <th scope="row">{state.title}</th>
                                    <th scope="row">{state.owner.name}</th>
                                    <th scope="row">{state.category.name}</th>
                                    <th scope="row">
                                      {state.status ? (
                                        <Badge color="success">Approved</Badge>
                                      ) : (
                                        <Badge color="info">Pending</Badge>
                                      )}
                                    </th>
                                    <th scope="row">
                                      <span>
                                        {moment(state.updated).fromNow()}
                                      </span>
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
                            Projects not found
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
        <ModalBody>
          {project ? (
            <>
              <div className="project-container">
                <div className="cover">
                  {project.video ? (
                    <iframe
                      src={project.video}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="youtube player"
                      className="yt-iframe"
                    />
                  ) : (
                    <div
                      className="project-cover"
                      style={{ backgroundImage: `url(${project.cover})` }}
                    />
                  )}
                </div>
                <h5 className="project-title mt-3">{project.title}</h5>
                <div className="project-fund-details">
                  <Progress
                    value={Math.round((project.amount / project.funded) * 100)}
                  />
                  <h2 className="progress-meter-heading">
                    ₮{Number(project.funded.toFixed(1)).toLocaleString()}
                    <span className="text-stat text-stat-title">
                      raised of ₮
                      {Number(project.amount.toFixed(1)).toLocaleString()} goal
                    </span>
                  </h2>
                  <hr className="mt-2 mb-2" />
                  <div>
                    <div className="row">
                      <div className="col-2">
                        <div className="owner-avatar-container">
                          {project.owner.avatar === null ? (
                            <div
                              className="owner-avatar"
                              style={{
                                backgroundImage: `url(${project.owner.avatar})`,
                              }}
                            />
                          ) : (
                            <div className="owner-avatar-preview">
                              {" "}
                              {project.owner.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col owner-info">
                        <Link to={"/admin/user/" + project.owner._id}>
                          {project.owner.name}
                        </Link>{" "}
                        created this project •
                        {moment(project.created).fromNow()}
                      </div>
                    </div>
                    <hr className="mt-2 mb-2" />
                  </div>
                </div>
                <div
                  className="project-content"
                  dangerouslySetInnerHTML={{
                    __html: json_to_html(JSON.parse(project.content)),
                  }}
                ></div>
              </div>
              <div className="project-footer mt-4">
                <div className={reject ? "decline-container" : null}>
                  {project.status === false &&
                  !reject &&
                  project.rejected === false ? (
                    <Button
                      color="link"
                      className="text-danger"
                      onClick={() => setReject(true)}
                    >
                      Decline
                    </Button>
                  ) : project.rejected ? (
                    <p className="text-warning not-updated">
                      This project is not updated
                    </p>
                  ) : null}
                  {reject ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        disable(true);
                        if (rejectText.trim()) {
                          axios
                            .post("/api/project/reject", {
                              reason: rejectText,
                              id: project._id,
                            })
                            .then((res) =>
                              res.data.status
                                ? window.location.reload()
                                : alert(res.data.msg)
                            );
                        }
                      }}
                    >
                      <FormGroup className="mb-0">
                        <Label>Enter reason to decline</Label>
                        <Input
                          type="textarea"
                          name="text"
                          autoFocus={true}
                          required
                          disabled={disabled}
                          onChange={(e) => {
                            setRejectText(e.target.value);
                          }}
                        />
                      </FormGroup>
                      <div className="float-right">
                        <Button
                          color="link"
                          className="text-muted p-0 mt-2 mr-2"
                          onClick={toggle}
                          disabled={disabled}
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          color="link"
                          disabled={disabled}
                          className="text-danger p-0 mt-2"
                          type="submit"
                        >
                          Decline
                        </Button>
                      </div>
                    </form>
                  ) : null}
                </div>
                <div className={reject ? "d-none" : null}>
                  {project.status === false ? (
                    <Button
                      color="primary"
                      disabled={disabled}
                      onClick={() => {
                        disable(true);
                        axios
                          .get("/api/project/approve/" + project._id)
                          .then((res) =>
                            res.data.status
                              ? window.location.reload()
                              : alert(res.data.msg)
                          );
                      }}
                    >
                      Approve
                    </Button>
                  ) : null}
                  <Button
                    color="secondary"
                    onClick={toggle}
                    disabled={disabled}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-3">
              <Spinner color="primary" />
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};
export default Projects;
