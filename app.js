// importo Express
const express = require("express");
const app = express();
const port = 3000;

// middleware statici
app.use(express.static("public"));

// body-parser per JSON
app.use(express.json());

// importo il router dei post
const router = require("./routers/postsRouter");

//_____________________________________________________________________

// importo globalmente il middleware di gestione errore server
const errorServer = require("./middlewares/errorServer");

// importo globalmente il middleware notfound 404 per rotta inesistente
const notFound = require("./middlewares/notFound");

//_____________________________________________________________________

// rotta di index
app.get("/", (req, res) => {
  res.send("Server del mio blog");
});

// registro il router con prefisso /posts
app.use("/posts", router);
//_____________________________________________________________________

// richiamo middleware gestione errori server
app.use(errorServer);

// richiamo middleware gestione errore 404 rotta non esistente
app.use(notFound);

//_____________________________________________________________________

// avvio server
app.listen(port, () => {
  console.log(`✅ Server avviato sulla porta ${port}`);
});
