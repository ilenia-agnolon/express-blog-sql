//import dei dati nel controller
const posts = require("../data/posts");

//import della connessione nel controller dei post
const db = require("../data/db"); // connessione MySQL

/******************************************************************************/

// INDEX (NUOVA VERSIONE)
function index(req, res) {
  const sql = "SELECT * FROM posts";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Errore query:", err);
      return res.status(500).json({ error: "Errore interno del server" });
    }
    res.json(results);
  });
}

/******************************************************************************/
// SHOW (NUOVA VERSIONE)
function show(req, res) {
  // recuperiamo l'id dall'URL
  const id = req.params.id;

  // prima query: cerchiamo il post con quell'id
  const postSql = "SELECT * FROM posts WHERE id = ?";

  // seconda query: cerchiamo tutti i tag collegati a quel post
  const tagsSql = `
        SELECT T.*
        FROM tags T
        JOIN post_tag AS PT ON T.id = PT.tag_id
        WHERE PT.post_id = ?;
    `;

  // eseguiamo la prima query (post singolo)
  db.query(postSql, [id], (err, postResults) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (postResults.length === 0)
      return res.status(404).json({ error: "Post not found" });

    // recuperiamo il post
    const post = postResults[0];

    // se il post esiste, eseguiamo la query per i tag
    db.query(tagsSql, [id], (err, tagsResults) => {
      if (err) return res.status(500).json({ error: "Database query failed" });

      // aggiungiamo i tag al post
      post.tags = tagsResults;

      // rispondiamo con il post completo
      res.json(post);
    });
  });
}

/******************************************************************************/

// STORE -> POST /posts -> crea un nuovo post
function store(req, res) {
  console.log("Dati ricevuti:", req.body);
  //genero  un nuovo id aggiungendo 1 all'ultimo id esistente
  const newId = posts[posts.length - 1].id + 1;

  //creo un nuovo post
  const newPost = {
    id: newId,
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
    tags: req.body.tags,
  };

  //aggiungo il nuovo posto nel blog
  posts.push(newPost);

  // controllo
  console.log(posts);

  //restituisco lo status corretto e il nuovo post
  res.status(201);
  res.json(newPost);
}

/******************************************************************************/

// UPDATE -> PUT /posts/:id -> aggionra un post
function update(req, res) {
  //recupero id
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);

  //404
  if (!post) {
    res.status(404);
    return res.json({
      error: "Not Found",
      message: "Post non trovato",
    });
  }

  //aggiorno il post
  post.title = req.body.title;
  post.image = req.body.image;
  post.content = req.body.content;
  post.tags = req.body.tags;

  //controllo
  console.log(posts);

  //restituisco il post aggiornato
  res.json(post);
}

/******************************************************************************/

// MODIFY -> PATCH /posts/:id -> aggionra un post
function modify(req, res) {
  const id = parseInt(req.params.id);

  const post = posts.find((post) => post.id === id);

  //controllo
  if (!post) {
    res.status(404);

    return res.json({
      error: "Not Found",
      message: "Post non trovato",
    });
  }

  // _____________
  // aggiorno il post (verranno aggiornati solo i campi inviati nel body JSON)
  req.body.title ? (post.title = req.body.title) : (post.title = post.title); // --> se nel body (req.body) è presente un valore title, aggiorna post.title con quel valore. Altrimenti lascia il valore precedente com’è

  req.body.image ? (post.image = req.body.image) : (post.image = post.image);

  req.body.content
    ? (post.content = req.body.content)
    : (post.content = post.content);

  req.body.tags ? (post.tags = req.body.tags) : (post.tags = post.tags);
  // _____________

  // controllo
  console.log(posts);

  // restituisco il post aggiornato
  res.json(post);
}

/******************************************************************************/

// DESTROY (NUOVA VERSIONE)
function destroy(req, res) {
  // recuperiamo l'id dall'URL
  const { id } = req.params;

  // query SQL per eliminare il post
  const sql = "DELETE FROM posts WHERE id = ?";

  // eliminiamo il post dal database
  db.query(sql, [id], (err) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Errore durante l'eliminazione del post" });

    // 204 = No Content → eliminazione riuscita, nessun body nella risposta
    res.sendStatus(204);
  });
}

/******************************************************************************/

module.exports = { index, show, store, update, modify, destroy };
