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
} from "reactstrap";
// UwU
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
// core components
import Header from "components/Headers/Header.js";
import "./style.scss";
const Verify = () => {
  const [state, setState] = useState(null);
  useEffect(() => {
    axios.get("/api/document").then((res) => setState(res.data.result));
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
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">User Document Verification</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="table-data">
                    {state ? (
                      <Table
                        className="align-items-center table-flush"
                        responsive
                      >
                        <thead className="thead-light">
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">email</th>
                            <th scope="col">Status</th>
                            <th scope="col">Submitted at</th>
                            <th scope="col" />
                          </tr>
                        </thead>
                        <tbody>
                          {state.map((state, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">
                                  <span className="mb-0 text-sm">
                                    <Link to={`/admin/user/${state.user._id}`}>
                                      {state.user.name}
                                    </Link>
                                  </span>
                                </th>
                                <th scope="row">{state.user.phone}</th>
                                <th scope="row">{state.user.email}</th>
                                <th scope="row">
                                  {state.user.verification_status}
                                </th>
                                <th scope="row">
                                  {moment(state.document.created).fromNow()}
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
                                        to={`/admin/document/${state.document._id}`}
                                        className="dropdown-item"
                                      >
                                        View
                                      </Link>
                                      <DropdownItem
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
                                        style={{ color: "red" }}
                                      >
                                        Delete
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
    </>
  );
};
export default Verify;
