/*eslint-disable*/
import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className="py-5">
          <Container>
            <Row className="align-items-center justify-content-xl-between">
              <Col xl="6">
                <div className="copyright text-center text-xl-left text-muted">
                  © {new Date().getFullYear()}
                  <a className="font-weight-bold ml-1" href="#" target="_blank">
                    Troth LLC
                  </a>
                </div>
              </Col>
              <Col xl="6">
                <Nav className="nav-footer justify-content-center justify-content-xl-end">
                  <NavItem>
                    <NavLink href="#" target="_blank">
                      Link
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#" target="_blank">
                      Link
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#" target="_blank">
                      Link
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#" target="_blank">
                      Link
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
