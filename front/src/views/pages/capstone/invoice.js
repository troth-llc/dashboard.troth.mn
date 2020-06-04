import React, { useEffect, useState } from "react";
import {
  Row,
  Card,
  CardHeader,
  Container,
  CardBody,
  Col,
  Spinner,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";
import moment from "moment";
const CapstoneInvoice = () => {
  const [state, setState] = useState(null);
  useEffect(() => {
    const get = () => {
      axios
        .get("/api/invoice/capstone")
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
              <CardHeader className="bg-transparent d-flex">
                <h3 className="mb-0" style={{ lineHeight: "50px" }}>
                  Capstone Invoices
                </h3>
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
                                <th scope="col">Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Payment ID</th>
                                <th scope="col">Transaction ID</th>
                                <th scope="col">Bill ID (User ID)</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.map((state) => {
                                return (
                                  <tr key={state._id}>
                                    <th scope="row">{state.description}</th>
                                    <th scope="row">{state.status}</th>
                                    <th scope="row">{state.payment_id}</th>
                                    <th scope="row">{state.transaction_id}</th>
                                    <th scope="row">{state.bill_id}</th>
                                    <th scope="row">{state.amount}</th>
                                    <th scope="row">
                                      <span>
                                        {moment(state.date).fromNow()}
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
                            Invoice not found
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
    </>
  );
};
export default CapstoneInvoice;
