const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/client/build"));

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
  res.sendFile(__dirname + "/client/build/index.html");
});

app.post("/signUp", async (req, res) => {
  if (
    req.body.username !== "" ||
    req.body.password !== "" ||
    req.body.email !== ""
  ) {
    const acc = await Account.find({ username: req.body.username });
    if (acc.length > 0) {
      res.json({ success: false, message: "Username already taken!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newAcc = new Account({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, salt),
        email: req.body.email,
      });
      newAcc.save();
      res.json({ success: true });
    }
  } else {
    res.json({ success: false, message: "Please fill out all fields!" });
  }
});

app.post("/logIn", async (req, res) => {
  const acc = await Account.find({ username: req.body.username });
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
  const account = await Account.findOne({ _id: req.body.accountId });
  if (account) {
    res.json({ success: true, account });
  } else {
    res.json({ success: false });
  }
});

app.post("/createLobby", async (req, res) => {
  const acc = await Account.findById(req.body.accountId);
  const newLobby = new Lobby({
    ownerId: acc._id,
    ownerName: acc.username,
  });
  await newLobby.save();
  acc.lobbyId = newLobby._id;
  await acc.save();
  res.json({ success: true, lobbyId: newLobby._id });
});

app.get("/getLobbies", async (req, res) => {
  const lobbies = await Lobby.find({ opponentId: null });
  res.json({ lobbies: lobbies });
});

app.post("/getLobby", async (req, res) => {
  const lobby = await Lobby.findById(req.body.lobbyId);
  res.json({ lobby: lobby, success: true });
});

app.post("/makeMove", async (req, res) => {
  const lobby = await Lobby.findById(req.body.lobbyId);
  if (req.body.accountId === lobby.ownerId && lobby.ownerMove === "") {
    lobby.ownerMove = req.body.move;
    lobby.ownerPlayed = true;
  } else if (
    req.body.accountId === lobby.opponentId &&
    lobby.opponentMove === ""
  ) {
    lobby.opponentMove = req.body.move;
    lobby.opponentPlayed = true;
  }
  lobby.save();
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
  if (!lobby) {
    res.status(404).json({ success: false });
    return;
  }
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
  const acc = await Account.findById(req.body.accountId);
  acc.lobbyId = req.body.lobbyId;
  await acc.save();
  const lobby = await Lobby.findById(req.body.lobbyId);
  if (lobby.ownerId !== req.body.accountId) {
    lobby.opponentId = acc._id;
    lobby.opponentName = acc.username;
  }
  await lobby.save();
  res.json({ success: true });
});

app.post("/leaveLobby", async (req, res) => {
  const lobby = await Lobby.findById(req.body.lobbyId);
  if (req.body.playerId === lobby.ownerId) {
    await Lobby.deleteOne({ _id: req.body.lobbyId });
  } else if (req.body.playerId === lobby.opponentId) {
    lobby.opponentId = null;
    lobby.opponentName = "";
    lobby.save();
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
  const topAccounts = await Account.find().sort({ rankPoints: -1 }).limit(10);
  const topIds = [];
  for (let i = 0; i < topAccounts.length; i++) {
    const newJson = {
      name: topAccounts[i].username,
      rankPoints: topAccounts[i].rankPoints,
    };
    topIds.push(newJson);
  }
  res.json({ topAccounts: topIds });
});

app.listen(3001);
