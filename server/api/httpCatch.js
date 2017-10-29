var HttpError = require('./httpError.js');

function httpCatch(res, next) {
    return function (err) {
        if (err instanceof HttpError)
            return res.status(err.code).json(err.data);

        return next(err);
    };
};

module.exports = httpCatch;