import mongoose from 'mongoose'

export const ConnectDB = async ()=> {
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('Database Connected Successfully'))
}