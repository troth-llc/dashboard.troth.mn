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

const Users = () => {
  const [users, setUsers] = useState(null);
  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data.user));
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
                <h3 className="mb-0">Users</h3>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="table-data">
                    {users ? (
                      <Table
                        className="align-items-center table-flush"
                        responsive
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
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
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
    </>
  );
};
export default Users;
