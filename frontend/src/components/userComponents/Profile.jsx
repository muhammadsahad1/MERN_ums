// Signup.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import FormContainer from "./FormContainer";
import Loader from "./Loader";
import toast , {Toaster} from "react-hot-toast";
import { useUpdateUserMutation } from "../../slices/userSlices/usersApiSlices";
import { setCredentials } from "../../slices/userSlices/authSlices";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectimage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileDisplayImg, setProfileImg] = useState(false);

  const dispatch = useDispatch();

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectimage(file);
    setProfileImg(true)
  };

  const toggleEditMode = () => {
    setIsEditMode(true);
  };

  const submitHandler = async (e) => {
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
      formData.append("_id", userInfo._id);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", selectedImage);

      const res = await updateProfile(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile Updated");
      setIsEditMode(false);
      setProfileImg(false);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }

    // Handle signup logic here
  };

  return (
    <FormContainer>
      <Toaster />
      <div className="text-center mb-6">
        {profileDisplayImg == true ? (
          <div className="text-center mb-6">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Profile"
              className="w-24 h-24 rounded-full mt-3 mx-auto"
            />
          </div>
        ) : (
          <img
            src={userInfo.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mt-3 mx-auto"
          />
        )}
      </div>
      <h1 className="text-center mb-4">Profile</h1>
      {isEditMode ? (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="profileImage">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 mb-2 block w-full shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300 rounded-md"
            />
          </Form.Group>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          {isLoading && <Loader />}
          <Button type="submit" variant="primary" className="mt-3">
            Update
          </Button>
        </Form>
      ) : (
        <div>
          <p className="mb-3">
            <strong>Name:</strong> {userInfo.name}
          </p>
          <p className="mb-3">
            <strong>Email:</strong> {userInfo.email}
          </p>
          <Button onClick={toggleEditMode} variant="primary" className="mt-3">
            Edit Profile
          </Button>
        </div>
      )}
    </FormContainer>
  );
};

export default Profile;
