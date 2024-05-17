import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Stote context
import store from "./store/store.jsx";
import { Provider } from "react-redux";

//  ================================= User Components
import Login from "./components/userComponents/Login.jsx";
import Signup from "./components/userComponents/Signup.jsx";
import HomeScreen from "./screens/userScreen/HomeScreen.jsx";
import ProfileScreen from "./screens/userScreen/ProfileScreen.jsx";
import PrivateRouter from "./components/userComponents/PrivateRouter.jsx";

//  ================================= Admin Components
import AdminLoginScreen from "./screens/userScreen/adminScreens/AdminLoginScreen.jsx";
import AdminHome from "./screens/userScreen/adminScreens/AdminHome.jsx";
import AdminPrivateRouter from "./components/adminComponents/adminPrivateRouter.jsx";
import AdminDashboard from "./screens/userScreen/adminScreens/AdminDashboard.jsx";
import Admin from "./components/adminComponents/Admin.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <HomeScreen />,
  },
  // PrivateRouter ===> 
  {
    path: "",
    element: <PrivateRouter />,
    children: [
      {
        path: "/profile",
        element: <ProfileScreen />,
      },
    ],
  },
  // Admin Routes
  {
    path : '/admin',  
    element :<AdminLoginScreen />
  },
  {
    path : '/admin',
    element : <AdminPrivateRouter><Admin/></AdminPrivateRouter>,
    children :[
      {
        path :'home',
        element : <AdminHome />
      },
      {
        path : 'dashboard',
        element : <AdminDashboard />
      }
    ]
  }


]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
