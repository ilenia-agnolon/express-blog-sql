function errorServer(err, req, res, next) {
  res.status(500);
  res.json({
    error: err.message,
  });
} //il server non è riuscito a gestire una richiesta valida

module.exports = errorServer;
