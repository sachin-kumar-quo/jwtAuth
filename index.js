import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./src/routes/crmRoutes";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/CRMdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//jwt

app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    req.token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(req.token, "secret", (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

routes(app);

// serving static files
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
  console.log(`your server is running on port ${PORT}`)
);
