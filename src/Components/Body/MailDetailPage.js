import { useEffect, useState } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { mailStoreActions } from "../../store/MailStore";
import styles from "./MailDetailPage.module.css";

const MailDetailPage = () => {
  const { id } = useParams();
  const [currentMail, setCurrentMail] = useState({});
  const dispatch = useDispatch();
  const email = localStorage.getItem("email").split("@")[0].toLowerCase();
  const unReadMailCount = useSelector(state => state.mailStore.unReadMailCount);
  const history = useHistory();

  useEffect(() => {
    const fetchMailData = async () => {
      try {
        const response = await fetch(
          `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/inbox/${id}.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setCurrentMail(data);

        if (!data.read) {
          await fetch(
            `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/inbox/${id}.json`,
            {
              method: "PUT",
              body: JSON.stringify({
                ...data,
                read: true,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          dispatch(mailStoreActions.setUnReadMailCount(unReadMailCount - 1));
        }
      } catch (error) {
        console.error("Error fetching and updating mail data:", error);
      }
    };

    fetchMailData();
  }, [email, id, dispatch, unReadMailCount]);

  const goBackHandler = () => {
    history.goBack();
  };

  return (
    <Container className={styles.container}>
      <h1 className={styles.mailTitle}>Mail Details</h1>
      <Row className={`${styles.mailDetailRow} ${styles.mailSender}`}>
        <div>From: {currentMail.sender}</div>
      </Row>
      <Row className={`${styles.mailDetailRow} ${styles.mailSubject}`}>
        <div>Subject: {currentMail.subject}</div>
      </Row>
      <Row className={`${styles.mailDetailRow} ${styles.mailBody}`}>
        <div>{currentMail.bodyMessage}</div>
      </Row>
      <Button className={styles.backButton} onClick={goBackHandler}>
        Back to Inbox
      </Button>
    </Container>
  );
};

export default MailDetailPage;
