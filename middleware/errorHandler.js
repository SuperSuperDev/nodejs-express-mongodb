function errorHandler(err, req, res, next) {
  console.log('There was an error')
  console.log(err.name)
  console.log(err)


  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid parameter given' })
  }

  if (err.name === 'NotFound') {
    return res.status(err.status).json({ error: { name: err.name, message: err.message } })
  }

  if (err.name === 'NotValid') {
    return res
      .status(err.status)
      .json({ message: 'There was an error, Details provided are not valid' })
  }
  
  if (err.name === 'NotAuthorized') {
    return res.status(err.status).send({ error: { name: err.name, message: err.message } })
  }

  if (err.name === 'ValidationError') {
    const errors = {}
    for (const key in err.errors) {
      errors[key] = err.errors[key].message
    }
    return res.status(422).json({
      message: 'Form Validation Error',
      errors,
    })

  }

  res.sendStatus(500)
  next(err)
}

export default errorHandler
