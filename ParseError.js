class ParseError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ParseError',
            Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ParseError;