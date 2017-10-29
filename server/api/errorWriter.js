module.exports = function (error) {
    if (!(error instanceof Array))
        error = [error];

    return {
        'error': error.map(x => {
            if (typeof x === 'string')
                return {
                    message: x
                };
            else if (typeof x === 'object')
                return {
                    message: x.message,
                    property: '@.' + x.property,
                    path: x.property
                };
        }),
        'valid': false
    };
};