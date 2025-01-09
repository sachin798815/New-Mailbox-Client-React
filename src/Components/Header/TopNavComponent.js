import { Navbar, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const TopNavComponent = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const unReadMailCount = useSelector(
    (state) => state.mailStore.unReadMailCount
  );

  return (
    <Navbar className="bg-secondary h-auto m-0">
      <Row xs={6}>
        <Navbar.Brand href="#home" className="m-2">
          Mailbox-Client
        </Navbar.Brand>
      </Row>
      <Row xs={6} className="mx-5 border rounded-3">
        {isAuthenticated && (
          <Link to="/inbox" className="text-decoration-none w-100">
            {unReadMailCount} New mail
          </Link>
        )}
      </Row>
    </Navbar>
  );
};
export default TopNavComponent;
