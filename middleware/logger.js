function logger(req, res, next) {
  console.log(`Incoming Request ${req.method} for URL ${req.url} ${Date.now()}`)
  console.log(` Body: ${JSON.stringify(req.body, null, 2)}`)
  next()
}
export default logger