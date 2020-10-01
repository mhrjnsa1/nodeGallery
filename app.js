const express = require("express");
const app = express();
const router = express.Router();
const multer = require("multer");
const flash = require("connect-flash");
const router = require("./Router/fileUpload");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
mongoose.connect(
  "mongodb+srv://mongooseDb:mongooseDb@mongocluster.9u2ud.mongodb.net/Gallery?retryWrites=true&w=majority"
);
app.use(express.urlencoded({ extended: false }));
router.use(expressLayouts);
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
  })
);
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "gallery");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(flash());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("image", 10)
);
app.use("/gallery", express.static(path.join(__dirname, "gallery")));
app.use(express.static(path.join(__dirname)));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use("/", router);
app.get("/", (req, res, next) => {
  res.send("<h2>welcome to gallery</h2>");
});
const port = process.env.PORT || 3000;
app.listen(port);
