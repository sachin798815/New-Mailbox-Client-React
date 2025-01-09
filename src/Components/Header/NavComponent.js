import { useState } from "react";
import { Button, Nav, Navbar, Container } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ComposeEmailPage from "../Body/ComposeEmailPage";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/AuthStore";

const NavComponent = () => {
  const [showCompose, setShowCompose] = useState(false);
  const dispatch =useDispatch();
  const history=useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const isAuthenticated = true;
  const showComposeFunction = () => {
    setShowCompose((prev) => !prev);
  };
  const logOutFunction=()=>{
    dispatch(authActions.logout());
    history.push('/');
  }

  return (
    isAuthenticated && (
      <Navbar
        bg="light"
        className="flex-column align-items-start p-3 h-100 bg-secondary"
      >
        <Container>
          <Nav className="flex-column">
            <Button
              variant="primary"
              className="my-2"
              onClick={showComposeFunction}
            >
              COMPOSE
            </Button>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              HOME
            </NavLink>
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
            <Button
              variant="danger"
              className="my-2"
              onClick={logOutFunction}
            >
              LOGOUT
            </Button>
          </Nav>
        </Container>
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
