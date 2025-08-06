const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const userRoutes = require("./routes/user");
const blogPostRoutes = require('./routes/blogPost');
const commentRoutes = require('./routes/comment');


require('dotenv').config();

const app = express();

const corsOptions = {
	origin:['https://travel-blog-app-bongabong.vercel.app'],
	credentials: true, 
	optionsSuccessStatus: 200
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));


app.use("/users", userRoutes);
app.use('/posts', blogPostRoutes);
app.use('/comments', commentRoutes);


if(require.main === module){
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000 }`)
    });
}

module.exports = { app, mongoose };