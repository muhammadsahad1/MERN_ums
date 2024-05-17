import mongoose from "mongoose";


const connetDB = async () => {
  try {
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI)
    .then((data) => console.log('db connected'))
    // .catch(error){
    //   console.log('error', error)
    // }

  } catch (error) {
    console.log(`Error : ====> ${error}`)
    process.exit(1)
  }
}

export default connetDB    