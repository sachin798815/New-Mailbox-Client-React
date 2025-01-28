import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./SentPage.module.css";

const SentPage = () => {
  const [mailList, setMailList] = useState([]);
  const email = localStorage.getItem("email").split("@")[0].toLowerCase();

  useEffect(() => {
    fetch(
      `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/sent.json`,
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
            recipient: data[key].recipient,
            bodyMessage: data[key].bodyMessage,
          }));
          setMailList(mails);
        }
      });
  }, [email]);

  const deleteMailHandler = (id) => {
    fetch(
      `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/sent/${id}.json`,
      {
        method: "DELETE",
      }
    ).then(() => {
      const newMailList = mailList.filter((mail) => mail.id !== id);
      setMailList(newMailList);
    });
  };

  return (
    <>
      <h1 className={styles.sentTitle}>SENT MAILS</h1>
      <Row className={styles.headerRow}>
        <Col className={styles.recipientHeader}>Recipient</Col>
        <Col className={styles.messageHeader}>Message</Col>
        <Col className={styles.deleteHeader}>Delete</Col>
      </Row>
      {mailList.map((mail) => (
        <Row key={mail.id} className={styles.sentRow}>
          <Col className={styles.recipientCol}>
            <Link
              to={`/sent/${mail.id}`}
              className="text-decoration-none text-dark"
            >
              {mail.recipient}
            </Link>
          </Col>
          <Col className={styles.messageCol}>
            <Link
              to={`/sent/${mail.id}`}
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

export default SentPage;
