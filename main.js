const express = require("express")
const fs = require("fs")
const session = require('express-session')
const multer = require('multer')
var cors = require("cors");
// const userModel = require("./database/models/users");
var path = require('path')

const startDb = require("./database/init");
const userModel = require("./database/models/users")
const todoModel = require("./database/models/todo")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

startDb();

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

/* app.use(function(req, res, next)
{
	console.log(req.url);
	next();
}) */

app.use("/uploads",express.static("uploads"));
// const upload = multer({ dest: 'uploads' })
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	  },
	  filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
	  }
	})
  
  const upload = multer({ storage: storage })
app.use(
	cors({
	  // origin: ["https://ecommerce370001.herokuapp.com"],
	  origin:["https://abhijit-dobby-front.herokuapp.com","http://localhost:3000"], 
	  methods: ["GET", "POST"],
	  credentials: true,
	})
  );
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.enable('trust proxy');
  app.use(
	session({
	  key: "userId",
	  proxy: true,
	  secret: "keyboard cat",
	  resave: false,
	  saveUninitialized: false,
	  cookie: { 
		  sameSite:'none',
		  secure: true }
	})
  );


const createUserControllers = require("./controllers/createUser");
const ImageDataControllers = require("./controllers/imageData");

app.route("/").get((req, res) => {
	res.json("hello");
  });

// PostTodo);

app.route("/signup").post(createUserControllers);


app.route("/login")
.get((req, res) => {
    console.log(req.session);
    if (req.session.isLoggedIn)
      res.send({ isLoggedIn: true, user: req.session.user });
    else res.send({ isLoggedIn: false });

    console.log(req.session)
  })
.post(function (req, res) {
    getUser(req.body.email, req.body.password, function (err, user) {
      if (user.length) {
        req.session.isLoggedIn = true;

        // req.session.name = user[0].firstname;
        req.session.user = user[0];

        console.log(req.session);

        res.json(req.session);
      } else {
        res.json(err);
      }
    });
  });
function getUser(username, password, callback) {
  userModel
    .find({ email: username, password: password })
    .then(function (data) {
      // console.log(data)
      callback(null, data);
    })
    .catch(function (err) {
      callback("user not found");
    });
}

app.post("/todo", upload.single("pic"), function (req, res) {
	console.log(req.body)
	const todo = {
		text: req.body.text,
		pic: req.file.filename,
		createdBy: req.session.user.email
	}

	saveTodo(todo, function () {
		res.redirect('http://localhost:3000')
	})
	// res.json()

})
function saveTodo(todo, callback) {

	todoModel.create(todo).then(function () {
		callback(null);
	})
		.catch(function () {
			callback("cant save todo")
		})
}

app.post("/todoData", ImageDataControllers)

app.get("/logout", function (req, res) {
	req.session.destroy();
	// res.redirect("http://localhost:3000/login")
})

app.post('/getData', async (req, res)=>{
	let payload = req.body.payload.trim()
	let search = await todoModel.find({createdBy:req.session.user.email,text: {$regex: new RegExp('^'+payload+'.*','i')}}).exec()
	//Limit Search results
	search = search.slice(0,10);
	res.json({payload: search});
})

app.listen( process.env.PORT || 3001, "0.0.0.0", function () {
	console.log("server is live");
  });
