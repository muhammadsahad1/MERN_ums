import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/userSlices/authSlices.js";
import { useUpdateUserDetailsMutation } from "../../slices/adminSlices/adminApiSlices.js";
import toast , {Toaster} from "react-hot-toast";
import Loader from "../userComponents/Loader.jsx";

const Editusers = ({ userData,isOpen,onClose }) => {
 const [userProfile,setUserProfile] = useState(null)
 const [name,setName] = useState('');
 const [email,setEmail] = useState('');
 const [selectedImage,setEditImage] = useState('');


 const dispatch = useDispatch();

 const [updateUser,{ isLoading }] = useUpdateUserDetailsMutation()

  useEffect(()=>{
    setUserProfile(userData.profileImage)
    setName(userData.name)
    setEmail(userData.email)
  },[])
  
  const handleImageChange = (e) => {
    setEditImage(e.target.files[0])
  }
  const handleSave = async (e) => {
    e.preventDefault();
    
    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
    const isNameValid = /^[a-zA-Z_-]{3,16}$/.test(name);
    
    let errors = {};
    
    if (!isEmailValid || email.trim() === "") {
      errors.email = "Please enter a valid email";
    }
    
    if (!isNameValid || name.trim() === "") {
      errors.name = "Please enter a valid name";
    }
    
    if (Object.keys(errors).length > 0) {
      // Display validation errors using toast
      Object.values(errors).forEach((errorMessage) => {
        toast.error(errorMessage);
      });
      return;
    }

    try {
      
      const formData = new FormData();
      formData.append('_id',userData._id);
      formData.append('name',name);
      formData.append('email',email);
      formData.append('password',userData.password);
      formData.append('image',selectedImage);

      const res = await updateUser(formData).unwrap()
      console.log("res ==>",res)
      dispatch(setCredentials({...res}))
      toast.success("Profile updated")
      
      onClose()

    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
 }

 
 return (
   <div className={`container mx-auto px-4 py-8${isOpen} ? '' : 'hidden'`}>
      { isLoading && <Loader />}
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        <form className="max-w-md mx-auto border-4 p-4 border-black">
        <div className="mb-4 ">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-3">Profile Image</label>
                            {selectedImage ? (<img src={URL.createObjectURL(selectedImage)} className='h-28 w-28 rounded-full mb-3' alt="Selected"  />) :
                                (<img src={userProfile} alt="" className='h-28 w-28 rounded-full mb-3' />)}
                            <input type="file" id="image" name='image' onChange={handleImageChange} accept="image/*" className="mt-1 mb-2 block w-full shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300 rounded-md"/>
                        </div>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Name</label>
                <input type="text" id="name" value={name} onChange={(e)=> setName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input type="email" id="email" value={email} onChange={ (e)=> setEmail(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
            </div>
            <button type="submit"  onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
            <button type="submit" onClick={onClose} className="bg-red-500 hover:red-blue-700 text-white font-bold ml-3 py-2 px-4 rounded">Close</button>
        </form>
<Toaster />
    </div>
);
}

export default Editusers
