import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { mailStoreActions } from "../../store/MailStore";

const MailDetailPage = () => {
  const { id } = useParams();
  const [currentMail, setCurrentMail] = useState({});
  const dispatch = useDispatch();
  const email = localStorage.getItem("email").split("@")[0].toLowerCase();
  const unReadMailCount = useSelector(state => state.mailStore.unReadMailCount);

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

  return (
    <Container>
      <h1 className="my-3">Mail Details</h1>
      <Row className="my-2">From : {currentMail.sender}</Row>
      <Row className="my-2">Subject : {currentMail.subject}</Row>
      <Row className="my-2">Message :</Row>
      <Row className="my-2">{currentMail.bodyMessage}</Row>
    </Container>
  );
};

export default MailDetailPage;
