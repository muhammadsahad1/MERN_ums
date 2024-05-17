import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../userComponents/FormContainer";
import Loader from "../userComponents/Loader";
import { useAddNewUserMutation } from "../../slices/adminSlices/adminApiSlices";
import toast , {Toaster} from "react-hot-toast";

const AddNewUser = ({isOpen,onClose}) => {
  const [image,setImage] = useState(null);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('')

  const [addNewUser,{isLoading}] = useAddNewUserMutation();

  // Creating a new User
  const handleCreateUser = async (e) => {
    e.preventDefault();

      const isEmailValid =
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
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
        
        const formData = new FormData();
        formData.append('name',name);
        formData.append('email',email);
        formData.append('password',password);
        formData.append('image',image)

        const res = await addNewUser(formData).unwrap()
        
        toast.success('User create successfully')
        
        onClose()
  } catch (error) {
    // Handling errors from API call
    toast.error(error?.data?.message);
  }
  }

  const handleImageChange = (e) => {
    const files = e.target.files[0]
    setImage(files)
  }
  
  return (
    <FormContainer >
      <Toaster />
      <h1> Add new user </h1>
      <Form >
      {isLoading && <Loader />}
      <div className="mb-3">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-3">Profile Image</label>
            {image ? (<img src={URL.createObjectURL(image)} className='h-28 w-28 rounded-full mb-3' alt="Selected"  />) : ( " ") }
                      <input type="file" id="image" name='image' onChange={handleImageChange} accept="image/*" className="mt-1 mb-2 block w-full shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300 rounded-md"/>
                        </div>
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

        <button type="submit"  onClick={handleCreateUser} className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create user</button>
            <button type="submit" onClick={onClose} className="bg-red-500 hover:red-blue-700 text-white font-bold ml-3 py-2 px-4 rounded">Close</button>
      </Form>
    </FormContainer>
  );
};


export default AddNewUser
