import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminPrivateRouter = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  console.log("adminInfo",adminInfo)
  return adminInfo ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default AdminPrivateRouter;
