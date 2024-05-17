import { Link } from "react-router-dom";

const AdminHomeBody = () => {
  return (
    
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
      <p className="text-lg mb-6">This is the admin home page.</p>

      <Link to="/admin/dashboard">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default AdminHomeBody;
