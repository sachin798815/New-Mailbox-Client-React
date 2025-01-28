import { useState } from "react";
import { Button, Nav, Navbar, Container } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ComposeEmailPage from "../Body/ComposeEmailPage";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/AuthStore";
import styles from "./NavComponent.module.css";

const NavComponent = () => {
  const [showCompose, setShowCompose] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const showComposeFunction = () => {
    setShowCompose((prev) => !prev);
  };

  const logOutFunction = () => {
    dispatch(authActions.logout());
    history.push("/");
  };

  return (
    isAuthenticated && (
      <Navbar
        className={`flex-column align-items-start p-3 h-100 bg-secondary ${styles.navColumn}`}
      >
        <Container>
          <Nav className="flex-column">
            <bdoutton
              className={styles.composeButton}
              onClick={showComposeFunction}
            >
              COMPOSE
            </bdoutton>

            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              INBOX
            </NavLink>
            <NavLink
              to="/sent"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              SENT
            </NavLink>
          </Nav>
        </Container>

        {/* Logout button placed at the end */}
        
        <Button
          variant="danger"
          className={`${styles.logoutButton}`}
          onClick={logOutFunction}
        >
          LOGOUT
        </Button>

        {showCompose && (
          <ComposeEmailPage
            onShow={showComposeFunction}
            showCompose={showCompose}
          />
        )}
      </Navbar>
    )
  );
};

export default NavComponent;
