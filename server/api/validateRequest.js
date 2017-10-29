var config = require('../config.js');
var Joi = require('joi');

module.exports = function (schema) {
    return function (req, res, next) {
        let options = {
            abortEarly: false
        };

        var model = Joi.validate(req.body, schema, options);
        if (model.error)
            return res.status(400).json({
                error: model.error.details,
                valid: false
            });
        else {
            res.locals.model = model.value;
            return next();
        }
    };
};