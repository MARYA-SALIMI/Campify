module.exports = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Sunucuda bir hata oluştu';

  res.status(statusCode).json({ code, message });
};