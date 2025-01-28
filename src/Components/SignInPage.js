import { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { authActions } from "../store/AuthStore";


const SignInPage = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSignIn, setisSignIn] = useState(true);
  const dispatch=useDispatch();
  const history =useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const loginToggleFunction = () => {
    setisSignIn((prev) => !prev);
  };

  const onSubmitFunction = async (e) => {
    e.preventDefault();
    const enteredEmail = emailRef.current ? emailRef.current.value : "";
    const enteredPassword = passwordRef.current ? passwordRef.current.value : "";
    const confirmPassword = confirmPasswordRef.current ? confirmPasswordRef.current.value : "";

    if (!isSignIn && enteredPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    let url;
    if (isSignIn) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDyrkJHNmWYJZ4n7cMyM9Z8ijsV2kiD6j0";
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDyrkJHNmWYJZ4n7cMyM9Z8ijsV2kiD6j0";
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sign up!");
      }

      const data = await response.json();
      console.log(data);
      dispatch(authActions.login({
        email: data.email,
        token: data.idToken,
      }))
      history.replace("/inbox");


      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={4} className="border border-3 rounded text-center">
          <Form onSubmit={onSubmitFunction} autoComplete="on">
            <div className="fw-bold fs-2 my-3">
              {isSignIn ? "Sign In" : "Sign Up"}
            </div>
            {errorMessage && (
              <p className="text-danger">
                {errorMessage}, please retry with correct credentials
              </p>
            )}
            <Form.Control
              type="email"
              placeholder="E-mail"
              ref={emailRef}
              className="mb-3"
              required
              autoComplete="on"
            ></Form.Control>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={passwordRef}
              className="mb-3"
              required
            ></Form.Control>
            {!isSignIn && (
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                ref={confirmPasswordRef}
                className="mb-3"
                required
              ></Form.Control>
            )}
            {isSignIn && (
              <Form.Group>
                <Button variant="light">
                  <Link to="/password">forgot password?</Link>
                </Button>
              </Form.Group>
            )}
            <Button type="submit" className="my-4 border rounded-pill px-5">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </Form>
        </Col>
        <Row className="justify-content-md-center mt-3">
          <Col xs={4} className="text-center">
            <Button
              variant="light"
              onClick={loginToggleFunction}
              className="w-100"
            >
              {isSignIn
                ? "Don't Have an account? Sign Up here"
                : "Have an account? Sign In here"}
            </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default SignInPage;
