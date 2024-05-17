import AdminHeader from "../../../components/adminComponents/adminHeader";
import {
  useGetUsersMutation,
  useDeleteUserMutation,
} from "../../../slices/adminSlices/adminApiSlices";
import { useEffect, useState } from "react";
import toast , {Toaster} from "react-hot-toast";
import Editusers from "../../../components/adminComponents/Editusers";
import Loader from "../../../components/userComponents/Loader";
import Swal from "sweetalert2";
import AddNewUser from "../../../components/adminComponents/addNewUser";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilterUser] = useState([]);
  const [isEditPageModal, setIsEditPageModal] = useState(false);
  const [isAddNewUserModal,setAddNewUserOpen] = useState(false);
  const [selectedEditUser, setSelectedEditUser] = useState(null);
  const [isExistingUser, setExistingUser] = useState(users?.length || 0);

  const [getUsers, { isLoading }] = useGetUsersMutation();
  const [deleteUser, { isDeleting }] = useDeleteUserMutation();

  // Fetching the users Data
  useEffect(() => {
    async function fetchData(){
      try {
        const usersData = await getUsers();
        setUsers(usersData.data);
      } catch (error) {
        toast.error("Failed to fetch users data");
      }
    };
    fetchData();
  }, [isEditPageModal, selectedEditUser, isExistingUser,isAddNewUserModal]);

  // Searching users
  useEffect(() => {
    let searchedUsers = filterUser(search, users);
    setFilterUser(searchedUsers);
  }, [search, users]);

  //Function for searching
  const filterUser = (text, usersList) => {
    if (text === '') {
      return usersList;
    } else {
      const filtered = usersList.filter((user) => {
        return (
          user.name.toLowerCase().includes(text.toLowerCase()) ||
          user.email.toLowerCase().includes(text.toLowerCase())
        );
      });
      return filtered;
    }
  };

  // Edit user
  function editPageModalHandle(selecteduser) {
    setSelectedEditUser(selecteduser);
    setIsEditPageModal(true);
  }

  const editPageModalClose = () => {
    setIsEditPageModal(false);
  };

  // Deleting the users
  const handleDeletuser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      iconColor: "#3F51B5",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3F51B5",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteUser({ userId: userId });
        
           if (res) {
            setExistingUser((prev) => prev - 1);
            toast.success("User deleted successfully");
    
            // deleting from localStorage
              const storedUser = JSON.parse(localStorage.getItem("userInfo"));
              if (storedUser && storedUser._id === userId) {
                localStorage.removeItem("userInfo");
              }
            
          }
        } catch (error) {
          toast.error(error?.data?.message || error.message);
        }
      }
    });
  };

  const addNewUserModalHandle = () => {
    setAddNewUserOpen(true)
  }

  const addNewUserModalClose = () => {
    setAddNewUserOpen(false);
  };


  return (
    <>
      <AdminHeader />
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <div className="flex justify-between">
  <input
    type="text"
    placeholder="Search users"
    className="px-4 py-2 border mb-4 border-black rounded-md focus:outline-none focus:border-blue-500"
    onChange={(e) => setSearch(e.target.value)}
  />
  <button className=" bg-black mb-3 text-white px-4 py-2 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" onClick={addNewUserModalHandle}>
    Add User
  </button>
</div>

      
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Profile Pic</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">CreatedAt</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              { filteredUsers ? (
                  filteredUsers?.map((user) => (
                    <tr key={user?._id}>
                      <td className="px-4 py-2">
                        <img
                          src={user?.profileImage}
                          alt="Profile Picture"
                          className="w-8 h-8 rounded-full"
                        />
                      </td>
    
                      <td className="px-4 py-2">{user?.name}</td>
                      <td className="px-4 py-2">{user?.email}</td>
                      <td className="px-4 py-2">
                        {new Date(user?.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-black text-white font-bold py-2 px-4 rounded"
                          onClick={() => editPageModalHandle(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                          onClick={() => handleDeletuser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                  users?.map((user) => (
                    <tr key={user?._id}>
                      <td className="px-4 py-2">
                        <img
                          src={user?.profileImage}
                          alt="Profile Picture"
                          className="w-8 h-8 rounded-full"
                        />
                      </td>
    
                      <td className="px-4 py-2">{user?.name}</td>
                      <td className="px-4 py-2">{user?.email}</td>
                      <td className="px-4 py-2">
                        {new Date(user?.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-black text-white font-bold py-2 px-4 rounded"
                          onClick={() => editPageModalHandle(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                          onClick={() => handleDeletuser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              ) }
            
            </tbody>
          </table>
        </div>
        {isLoading && <Loader />}
        {isDeleting && <Loader />}
      </div>

      {isEditPageModal && (
        <Editusers
          userData={selectedEditUser} isOpen={isEditPageModal} onClose={editPageModalClose}/>)}
      { isAddNewUserModal && (
        <AddNewUser isOpen={isAddNewUserModal} onClose={addNewUserModalClose}/>
      )}
    </>
  );
};

export default AdminDashboard;
