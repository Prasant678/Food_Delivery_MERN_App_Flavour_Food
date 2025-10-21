import mongoose from 'mongoose'

export const ConnectDB = async ()=> {
    await mongoose.connect('mongodb+srv://prasantrao917:Prasant567@cluster0.yzxfbbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>console.log('Database Connected Successfully'))
}