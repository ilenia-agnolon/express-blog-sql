function notFound(req, res, next) {
  res.status(404);
  res.json({
    error: "Not Found",
    message: "Pagina non trovata",
  });
} //la risorsa richiesta non esiste

module.exports = notFound;
