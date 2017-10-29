function HttpError(code, data) {
    this.name = 'HttpError';
    this.message = '';
    this.stack = (new Error()).stack;

    this.code = code;
    this.data = data;
}
HttpError.prototype = new Error();

module.exports = HttpError;