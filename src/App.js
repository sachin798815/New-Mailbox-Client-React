import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import "./App.css";
import SignInPage from "./Components/SignInPage";
import HomePage from "./Components/Body/HomePage";
import NavComponent from "./Components/Header/NavComponent";
import { Container, Row, Col } from "react-bootstrap";
import TopNavComponent from "./Components/Header/TopNavComponent";
import InboxPage from "./Components/Body/InboxPage";
import MailDetailPage from "./Components/Body/MailDetailPage";
import { useSelector } from "react-redux";
import SentPage from "./Components/Body/SentPage";
import SentDetailPage from "./Components/Body/SentDetaiPage";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Container fluid className="h-100 w-100 p-0">
      <TopNavComponent />
      <Row className="h-100 w-100">
        {/* Navbar Column */}
        <Col xs="auto" className="h-100">
          <NavComponent />
        </Col>

        {/* Content Column */}
        <Col className="h-100">
          <Switch>
            {!isAuthenticated && (
              <Route path="/" exact>
                <SignInPage />
              </Route>
            )}
            {isAuthenticated && (
              <Route path="/" exact>
                <InboxPage />
              </Route>
            )}
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/sent" exact>
              <SentPage />
            </Route>
            <Route path="/sent/:id">
            <SentDetailPage/>
            </Route>
            <Route path="/inbox" exact>
              <InboxPage />
            </Route>
            <Route path="/inbox/:id">
              <MailDetailPage />
            </Route>
          </Switch>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
