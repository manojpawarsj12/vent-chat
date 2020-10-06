const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const randomchatfu = require("./random_chat/random_chat");
const friends = require("./routes/friends");
const friendrequest = require("./routes/friendrequest");
const acceptfriendrequest = require("./routes/acceptrequest");
const rejectremove = require("./routes/rejectremove");
const search_user = require("./routes/searchuser");
const messages = require("./routes/messages");
const privatechat = require("./random_chat/private_message");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;
// middleware
app.use("/public", express.static(__dirname + "/public"));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// view engine
app.set("view engine", "ejs");

// database connection

// routes
app.get("*", checkUser);
app.get("/", (req, res) =>
  res.render("home", { clientusername: res.locals.user })
);
app.use(authRoutes);
app.get("/randomchat", requireAuth, (req, res) => {
  res.render("chat", { clientusername: res.locals.user });
});
app.use(friends);
app.use(friendrequest);
app.use(acceptfriendrequest);
app.use(rejectremove);
app.use(messages);
app.use(search_user);
randomchatfu(io);
privatechat(io);

const dbURI =
  // "mongodb+srv://manojpawarsj:manojtestdb@cluster0.9fxko.gcp.mongodb.net/dbusernames?retryWrites=true&w=majority";
  " mongodb://127.0.0.1:27017/dbusers";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => http.listen(PORT))
  .catch((err) => console.log(err));
