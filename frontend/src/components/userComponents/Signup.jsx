// Signup.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../../slices/userSlices/usersApiSlices";
import FormContainer from "./FormContainer";
import Loader from "./Loader";
import toast , {Toaster} from "react-hot-toast";
import { setCredentials } from "../../slices/userSlices/authSlices";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [register, { isLoading }] = useRegisterMutation();
  
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
  
  const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
  const isNameValid = /^[a-zA-Z_-]{3,16}$/.test(name);
  let errors = {};

  if (!isEmailValid || email.trim() == "") {
    errors.email = "Please enter a valid email";
  }

  if (!isNameValid || name.trim() == "") {
    errors.name = "Please enter a valid name";
  }

  if (Object.keys(errors).length > 0) {
    toast.error(errors.email);
    toast.error(errors.name);
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }
    
    
    try {
    
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/home");
      
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
    
  };

  return (
    <FormContainer>
      <Toaster />
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default Signup;
