const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://guichnicolas:njgy6lBj1LUKAxkx@cluster0.yvhlh.mongodb.net/",
);

const AccountSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  session: String,
  rankPoints: { type: Number, default: 5000 },
  lobbyId: { type: String, default: null },
});

const Account = mongoose.model("rpsaccounts", AccountSchema);

const LobbySchema = new mongoose.Schema({
  ownerId: String,
  ownerName: String,
  opponentId: { type: String, default: null },
  opponentName: { type: String, default: "" },
  ownerMove: { type: String, default: "" },
  opponentMove: { type: String, default: "" },
  ownerReceived: { type: Boolean, default: false },
  opponentReceived: { type: Boolean, default: false },
  ownerPlayed: { type: Boolean, default: false },
  opponentPlayed: { type: Boolean, default: false },
});

const Lobby = mongoose.model("rpslobbies", LobbySchema);

app.get("/", (req, res) => {
  res.send("Main");
});

app.post("/signUp", async (req, res) => {
  if (
    req.body.username != "" ||
    req.body.password != "" ||
    req.body.email != ""
  ) {
    let account = await Account.find({ username: req.body.username });
    if (account.length > 0) {
      res.json({ success: false, message: "Username already taken!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      let acc = new Account({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt),
        email: req.body.email,
      });
      acc.save();
      res.json({ success: true });
    }
  } else {
    res.json({ success: false, message: "Please fill out all fields!" });
  }
});

app.post("/logIn", async (req, res) => {
  let acc = await Account.find({ username: req.body.username });
  if (
    acc.length > 0 &&
    (await bcrypt.compare(req.body.password, acc[0].password))
  ) {
    res.json({ accountData: acc[0], success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/session", async (req, res) => {
  let acc = await Account.find({ _id: req.body.accountId });
  if (acc.length > 0) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/createLobby", async (req, res) => {
  let acc = await Account.find({ _id: req.body.accountId });
  let lobby = new Lobby({
    ownerId: acc[0]._id,
    ownerName: acc[0].username,
  });
  await lobby.save();
  acc[0].lobbyId = lobby._id;
  await acc[0].save();
  res.json({ success: true, lobbyId: lobby._id });
});

app.get("/getLobbies", async (req, res) => {
  let lobbyList = await Lobby.find();
  res.json({ lobbies: lobbyList });
});

app.post("/getLobby", async (req, res) => {
  let lobbyList = await Lobby.find({ _id: req.body.lobbyId });
  if (lobbyList.length === 0) {
    res.json({ success: false });
  } else {
    res.json({ lobby: lobbyList[0], success: true });
  }
});

app.post("/makeMove", async (req, res) => {
  let lobbyList = await Lobby.find({ _id: req.body.lobbyId });
  if (
    req.body.accountId === lobbyList[0].ownerId &&
    lobbyList[0].ownerMove === ""
  ) {
    lobbyList[0].ownerMove = req.body.move;
    lobbyList[0].ownerPlayed = true;
  } else if (
    req.body.accountId === lobbyList[0].opponentId &&
    lobbyList[0].opponentMove === ""
  ) {
    lobbyList[0].opponentMove = req.body.move;
    lobbyList[0].opponentPlayed = true;
  }
  lobbyList[0].save();
  res.json({ success: true });
});

function determineResult(lobby) {
  const ownerObject = lobby.ownerMove;
  const opponentObject = lobby.opponentMove;
  const validItems = ["rock", "paper", "scissors"];
  if (
    !validItems.includes(ownerObject) ||
    !validItems.includes(opponentObject)
  ) {
    return null;
  }
  if (ownerObject === opponentObject) {
    return "It's a tie!";
  } else if (ownerObject === "rock" && opponentObject === "paper") {
    return lobby.opponentName + " won!";
  } else if (ownerObject === "rock" && opponentObject === "scissors") {
    return lobby.ownerName + " won!";
  } else if (ownerObject === "paper" && opponentObject === "rock") {
    return lobby.ownerName + " won!";
  } else if (ownerObject === "paper" && opponentObject === "scissors") {
    return lobby.opponentName + " won!";
  } else if (ownerObject === "scissors" && opponentObject === "rock") {
    return lobby.opponentName + " won!";
  } else if (ownerObject === "scissors" && opponentObject === "paper") {
    return lobby.ownerName + " won!";
  }
}
// read function
app.post("/checkMove", async (req, res) => {
  const lobby = await Lobby.findById(req.body.lobbyId);
  res.json({ message: determineResult(lobby) });
});
// read
app.post("/checkBothPlayed", async (req, res) => {
  const lobby = await Lobby.findById(req.body.lobbyId);
  if (lobby.ownerPlayed && lobby.opponentPlayed) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
// write
app.post("/receivedResult", async (req, res) => {
  const lobby = await Lobby.findById(req.body.lobbyId);
  if (req.body.accountId === lobby.ownerId) {
    lobby.ownerReceived = true;
  } else if (req.body.accountId === lobby.opponentId) {
    lobby.opponentReceived = true;
  }
  if (lobby.ownerReceived && lobby.opponentReceived) {
    // change rank points here
    const result = determineResult(lobby);
    // handles incomplete game
    if (!result) {
      return res.json({ success: false });
    }
    if (result !== "It's a tie!") {
      const cleanedWinnerName = result.replace(/ won!$/, ""); //TODO: make the determine result return raw data
      const winnerAccount = await Account.findOne({
        username: cleanedWinnerName,
      });
      if (!winnerAccount) {
        return res.json({ success: false });
      }
      winnerAccount.rankPoints++;
      await winnerAccount.save();

      // decrement losers points
      const loserId =
        winnerAccount.id === lobby.ownerId ? lobby.opponentId : lobby.ownerId; // choose the opposite player as the loser
      const loserAccount = await Account.findById(loserId);
      if (!loserAccount) {
        return res.json({ success: false });
      }
      loserAccount.rankPoints--;
      await loserAccount.save();
    }

    lobby.ownerMove = "";
    lobby.opponentMove = "";
    lobby.ownerReceived = false;
    lobby.opponentReceived = false;
    lobby.ownerPlayed = false;
    lobby.opponentPlayed = false;
  }
  await lobby.save();
  res.json({ success: true });
});

app.post("/canMove", async (req, res) => {
  const lobby = await Lobby.findById(req.body.lobbyId);
  if (!lobby) {
    res.json({ success: false, message: "Lobby not found" });
    return;
  }
  if (req.body.accountId === lobby.ownerId && lobby.ownerMove === "") {
    res.json({ canMove: true });
    return;
  }
  if (req.body.accountId === lobby.opponentId && lobby.opponentMove === "") {
    res.json({ canMove: true });
    return;
  }
  res.json({ canMove: false });
});

app.post("/joinLobby", async (req, res) => {
  let acc = await Account.find({ _id: req.body.accountId });
  acc[0].lobbyId = req.body.lobbyId;
  await acc[0].save();
  let lobbyList = await Lobby.find({ _id: req.body.lobbyId });
  if (lobbyList[0].ownerId != req.body.accountId) {
    lobbyList[0].opponentId = acc[0]._id;
    lobbyList[0].opponentName = acc[0].username;
  }
  await lobbyList[0].save();
  res.json({ success: true });
});

app.post("/leaveLobby", async (req, res) => {
  let lobbyList = await Lobby.find({ _id: req.body.lobbyId });
  if (req.body.playerId === lobbyList[0].ownerId) {
    await Lobby.deleteOne({ _id: req.body.lobbyId });
  } else if (req.body.playerId === lobbyList[0].opponentId) {
    lobbyList[0].opponentId = null;
    lobbyList[0].opponentName = "";
    lobbyList[0].save();
  }
  res.json({ success: true });
});

app.post("/updateRankPoints", async (req, res) => {
  const acc = await Account.findById(req.body.accountId);
  acc.rankPoints += req.body.points;
  await acc.save();
  res.json({ success: true });
});

app.get("/getLeaderboard", async (req, res) => {
  let topAccounts = await Account.find().sort({ rankPoints: -1 }).limit(10);
  let topIds = [];
  for (let i = 0; i < topAccounts.length; i++) {
    let newJson = {
      name: topAccounts[i].username,
      rankPoints: topAccounts[i].rankPoints,
    };
    topIds.push(newJson);
  }
  res.json({ topAccounts: topIds });
});

app.listen(3001);
