export class NotFound extends Error {
  constructor(message) {
    super()
    this.name = 'NotFound'
    this.message = message
    this.status = 404
  }
}

export class NotValid extends Error {
  constructor() {
    super()
    this.name = 'NotValid'
    this.status = 400
  }
}

export class NotAuthorized extends Error {
  constructor(message) {
    super()
    this.name = 'NotAuthorized'
    this.message = message ? message : 'Unauthorized'
    this.status = 401
  }
}
