import dotenv from "dotenv";
import connectDB from "./db/index.js"
import { app } from "./app.js";
import initialiseAdmins from "./utils/initialiseAdmins.js";

dotenv.config({
    path:"./.env"
})
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gallery';

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
connectDB()
.then(() => {
    initialiseAdmins();
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});