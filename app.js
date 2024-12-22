const express =require("express");
const connectToDb= require("./config/connectToDb");
const { errorHanlder, notFound } = require("./middlwares.js/error");

require("dotenv").config();
/// ConnnecconnectToDbt to DB 

connectToDb();

///init app

const app=express();

///Midlewares

app.use(express.json());

app.use("/api/auth",require("./routes/authRoute"));
app.use("/api/auth",require("./routes/authRoute"));
app.use("/api/users",require("./routes/usersRoute"));
app.use("/api/posts",require("./routes/postsRoute"))
app.use("/api/comments",require("./routes/commentsRoute"));
app.use("/api/categories",require("./routes/categoryRoute"));


///error handler
app.use(notFound);
app.use(errorHanlder)

const PORT=process.env.PORT||8000;
app.listen(PORT ,()=>{
  console.log(`server is Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});