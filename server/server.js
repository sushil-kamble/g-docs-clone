require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const Document = require("./Document");

const PORT = process.env.PORT || 3001;
const INDEX = "/index.html";
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const url = `mongodb+srv://${username}:${password}@maincluster.3zce8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};
mongoose.connect(url, connectionParams);
const origin = process.env.PORT
  ? "https://g-docs.netlify.app"
  : "http://localhost:3000";

const io = require("socket.io")(server, {
  cors: {
    origin: origin,
    methods: ["GET", "POST"]
  }
});

const defaultValue = "";

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      console.log("LETS GO", data);
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
