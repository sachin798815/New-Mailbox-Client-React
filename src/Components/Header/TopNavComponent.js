import { Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import styles from "./TopNavComponent.module.css";

const TopNavComponent = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const unReadMailCount = useSelector(
    (state) => state.mailStore.unReadMailCount
  );

  return (
    <Navbar className={styles.topNav}>
      <a href="#home" className={styles.brand}>
        APNA-MAIL
      </a>
      {isAuthenticated && (
        <div className={styles.unreadMailContainer}>
          <Link to="/inbox" className={styles.unreadMailLink}>
            {unReadMailCount} Unread mails
          </Link>
        </div>
      )}
    </Navbar>
  );
};

export default TopNavComponent;
