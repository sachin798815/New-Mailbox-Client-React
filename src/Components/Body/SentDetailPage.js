import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const SentDetailPage = () => {
  const { id } = useParams();
  const [currentMail, setCurrentMail] = useState({});
  const email = localStorage.getItem("email").split("@")[0].toLowerCase();

  useEffect(() => {
    const fetchMailData = async () => {
      try {
        const response = await fetch(
          `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/sent/${id}.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setCurrentMail(data);

      } catch (error) {
        console.error("Error fetching and updating mail data:", error);
      }
    };

    fetchMailData();
  }, [email, id]);

  return (
    <Container>
      <h1 className="my-3">Mail details</h1>
      <Row className="my-2">To : {currentMail.recipient}</Row>
      <Row className="my-2">Subject : {currentMail.subject}</Row>
      <Row className="my-2">Message :</Row>
      <Row className="my-2">{currentMail.bodyMessage}</Row>
    </Container>
  );
};

export default SentDetailPage;
