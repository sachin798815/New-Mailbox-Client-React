import { useRef, useState } from "react";
import { Button, Container, Form, InputGroup, Modal } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

const ComposeEmailPage = (props) => {
  const emailRef = useRef();
  const subjectRef = useRef();
  const sendersMail = localStorage.getItem("email").split("@")[0];
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (state) => {
    setEditorState(state);
  };

  const sendMailFunction = (e) => {
    e.preventDefault();
    const email = emailRef.current.value.split("@")[0];
    const subject = subjectRef.current.value;
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const bodyMessage = draftToHtml(rawContentState); // converting to HTML format
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Body Message:", bodyMessage);
    fetch(
      `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${email}/inbox.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: sendersMail,
          subject: subject,
          bodyMessage: bodyMessage,
          read:false
        }),
      }
    );
    fetch(
      `https://mailbox-client-a25a4-default-rtdb.firebaseio.com/${sendersMail}/sent.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: email,
          subject: subject,
          bodyMessage: bodyMessage,
        }),
      }
    );
    props.onShow();
  };

  return (
    <Modal show={props.showCompose} onHide={props.onShow} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Compose</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={sendMailFunction}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1" className="border-0">
              to
            </InputGroup.Text>
            <Form.Control
              placeholder="enter email"
              aria-label="enter email"
              aria-describedby="basic-addon1"
              className="border-0"
              required
              ref={emailRef}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1" className="border-0">
              Subject
            </InputGroup.Text>
            <Form.Control
              placeholder="enter subject"
              aria-label="enter subject"
              aria-describedby="basic-addon1"
              className="border-0"
              required
              ref={subjectRef}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Container>
              <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
              />
            </Container>
          </InputGroup>
          <br />
          <Button type="submit">Send</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ComposeEmailPage;
