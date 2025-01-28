import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { mailStoreActions } from "../../store/MailStore";
import styles from "./InboxPage.module.css";

const InboxPage = () => {
  const [mailList, setMailList] = useState([]);
  const dispatch = useDispatch();
  const email = localStorage.getItem("email").split("@")[0].toLowerCase();
  const unReadMailCount = useSelector((state) => state.mailStore.unReadMailCount);

  useEffect(() => {
    const fetchData = () => {
      fetch(
        `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/inbox.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            const mails = Object.keys(data).map((key) => ({
              id: key,
              subject: data[key].subject,
              sender: data[key].sender,
              bodyMessage: data[key].bodyMessage,
              read: data[key].read,
            }));
            setMailList(mails);
            dispatch(mailStoreActions.setMailStoreList(mails));

            // update unread count
            const unreadCount = mails.filter((mail) => !mail.read).length;
            dispatch(mailStoreActions.setUnReadMailCount(unreadCount));
          }
        });
    };

    fetchData();

    //setting interval so that it fetches every 2 secs
    const intervalId = setInterval(fetchData, 2000);

    // clearing interval when component unmounts
    return () => clearInterval(intervalId);
  }, [email, dispatch]);

  const deleteMailHandler = (id) => {
    const mailToDelete = mailList.find((mail) => mail.id === id);
    fetch(
      `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/inbox/${id}.json`,
      {
        method: "DELETE",
      }
    ).then(() => {
      const newMailList = mailList.filter((mail) => mail.id !== id);
      setMailList(newMailList);
      dispatch(mailStoreActions.setMailStoreList(newMailList));

      // if deleted mail was unread, updating count
      if (!mailToDelete.read) {
        dispatch(mailStoreActions.setUnReadMailCount(unReadMailCount - 1));
      }
    });
  };

  return (
    <>
      <h1 className={styles.inboxTitle}>INBOX</h1>

      {/* Header Row for Sender and Message */}
      <Row className={styles.headerRow}>
        <Col className={styles.senderHeader}>Sender</Col>
        <Col className={styles.messageHeader}>Message</Col>
        <Col className={styles.deleteHeader}>Delete</Col>
      </Row>

      {/* Mail List */}
      {mailList.map((mail) => (
        <Row key={mail.id} className={styles.inboxRow}>
          <Col className={styles.senderCol}>
            <span className={mail.read ? "" : styles.newMail}>{mail.sender}</span>
          </Col>
          <Col className={styles.messageCol}>
            <Link
              to={`/inbox/${mail.id}`}
              className="text-decoration-none text-dark"
            >
              <div dangerouslySetInnerHTML={{ __html: mail.bodyMessage }} />
            </Link>
          </Col>
          <Col className={styles.deleteCol}>
            <Button
              variant="primary"
              className={styles.deleteButton}
              onClick={() => deleteMailHandler(mail.id)}
            >
              Delete
            </Button>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default InboxPage;
