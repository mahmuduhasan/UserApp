const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "userproject",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/user/insert", async (req, res) => {
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = await bcrypt.hash(req.body.userPassword, 10);
  const userMobile = req.body.userMobile;
  const userAddress = req.body.userAddress;
  const userPhotoPath = req.body.userPhotoPath;
  const insertSql =
    "INSERT INTO users (name,email,password,mobile,address,profile_photo_path) VALUES (?,?,?,?,?,?);";
  await db.query(
    insertSql,
    [userName, userEmail, userPassword, userMobile, userAddress, userPhotoPath],
    (err, result) => {
      if (err) res.send(err);
      else res.send("Done!");
    }
  );
});

app.post("/user/checkemail", (req, res) => {
  const userEmail = req.body.userEmail;
  const checkEmail = "SELECT * from users where email = ?;";
  db.query(checkEmail, [userEmail], (err, result) => {
    if (err) res.send(err);
    if (result.length > 0) {
      res.send(result[0].email);
    } else {
      res.send("New User");
    }
  });
});

app.get("/user/showuser", (req, res) => {
  const fetchSql =
    "SELECT name,email,password,mobile,address,profile_photo_path from users;";
  db.query(fetchSql, (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.delete("/user/delete/:userEmail", (req, res) => {
  const deleteUser = req.params.userEmail;
  const deleteSql = "DELETE from users where email = ?;";
  db.query(deleteSql, [deleteUser], (err, result) => {
    if (err) res.send(err);
  });
});

app.put("/user/update/:prevEmail", (req, res) => {
  const prevEmail = req.params.prevEmail;
  const name = req.body.name;
  const newEmail = req.body.email;
  const mobile = req.body.mobile;
  const address = req.body.address;
  const updateSql =
    "UPDATE users SET name=?, email=? ,mobile=? ,address=? WHERE email = ?;";
  db.query(
    updateSql,
    [name, newEmail, mobile, address, prevEmail],
    (err, result) => {
      if (err) res.send(err);
    }
  );
});

app.listen(3001, () => {
  console.log("Running in Port 3001!");
});
