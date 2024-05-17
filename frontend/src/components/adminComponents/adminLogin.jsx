import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../userComponents/FormContainer";
import { useAdminLoginMutation } from "../../slices/adminSlices/adminApiSlices";
import { setCredentials } from "../../slices/adminSlices/adminAuthSlices";
import Loader from "../userComponents/Loader";
import toast , {Toaster} from "react-hot-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {adminInfo} = useSelector((state) => state.adminAuth);
  
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  useEffect(()=>{

    if(adminInfo){
      navigate("/admin/home")
    }
  },[navigate,adminInfo])
  
  // Handle login stage
  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      const res = await adminLogin({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/admin/home");  
      toast.success("Admin logged");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <FormContainer>
      <Toaster />
      <h1>Admin Sign In</h1>

      <Form onSubmit={submitHandler}>
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

        <Button
          disabled={isLoading}
          type="submit"
          variant="primary"
          className="mt-3"
        >
          Sign In
        </Button>
      </Form>

      {isLoading && <Loader />}
    </FormContainer>
  );
};

export default AdminLogin;
