import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { mailStoreActions } from "../../store/MailStore";

const InboxPage = () => {
  const [mailList, setMailList] = useState([]);
  const dispatch = useDispatch();
  const email = localStorage.getItem("email").split("@")[0].toLowerCase();
  const unReadMailCount = useSelector(state => state.mailStore.unReadMailCount);

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
        .then(
          (res) => res.json())
          .then((data) => {
          if (data) {
            console.log(data);
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
            const unreadCount = mails.filter(mail => !mail.read).length;
            dispatch(mailStoreActions.setUnReadMailCount(unreadCount));
          }
        });
    };

    fetchData();

    //setting interval so that it fetched every 2 secs
    const intervalId = setInterval(fetchData, 2000);

    // clearing interval when component unmounts
    return () => clearInterval(intervalId);
  }, [email, dispatch]);

  const deleteMailHandler = (id) => {
    const mailToDelete = mailList.find(mail => mail.id === id);
    fetch(`https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/inbox/${id}.json`, {
      method: "DELETE",
    }).then(() => {
      const newMailList = mailList.filter(mail => mail.id !== id);
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
      <h1 className="my-3">INBOX</h1>
      <Row>
        <Col xs={1}></Col>
        <Col xs={2}>
          <strong>SENDER</strong>
        </Col>
        <Col xs={9}>
          <strong>MESSAGE</strong>
        </Col>
      </Row>
      <hr />
      {mailList.map((mail) => (
        <Row key={mail.id}>
          <Col xs={1} className="text-primary">{!mail.read && "NEW"}</Col>
          <Col xs={2}>
            <Link to={`/inbox/${mail.id}`} className="text-decoration-none text-dark">{mail.sender}</Link>
          </Col>
          <Col xs={7}>
            <Link to={`/inbox/${mail.id}`} className="text-decoration-none text-dark">
              <div dangerouslySetInnerHTML={{ __html: mail.bodyMessage }} />
            </Link>
          </Col>

          <Col xs={2}>
            <Button variant="danger" onClick={() => deleteMailHandler(mail.id)}>
              Delete
            </Button>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default InboxPage;
