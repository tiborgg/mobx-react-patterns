const express = require('express');
const router = express.Router();
const config = require('../../config.js');
const joi = require('joi');
const validator = require('../validateRequest.js');
const errorWriter = require('../errorWriter.js');
const httpCatch = require('../httpCatch.js');
const httpError = require('../httpError.js');
const fs = require('fs');
const request = require('request-promise-native');
const sizeOf = require('image-size');
const db = require('../../data.js');
const moment = require('moment');

/**
 * @api {get} /api/picture Get All
 * @apiDescription Get all Pictures.
 * @apiVersion 0.1.0
 * @apiName GetPicture
 * @apiGroup Picture
 * 
 * @apiSampleRequest /api/picture
 */
router.get('/', (req, res, next) => {
    const items = db.get('pictures').value();

    let o = [];
    items.forEach(x => {
        o.push(Object.assign({ url: `${config.siteUrl}/uploads/${x.albumId}/${x.id}.${x.ext}` }, x));
    });

    return res.status(200).json(o);
});

/**
 * @api {get} /api/picture/:id Get one
 * @apiDescription Get one picture.
 * @apiVersion 0.1.0
 * @apiName GetPictureById
 * @apiGroup Picture
 * 
 * @apiSampleRequest /api/picture/:id
 */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    let item = db.get('pictures').getById(id);
    if (!item.value())
        return res.status(404).json({ message: 'not found' });

    let album = db.get('albums').getById(item.value().albumId).value();

    let o = Object.assign({ url: `${config.siteUrl}/uploads/${item.value().albumId}/${item.value().id}.${item.value().ext}` }, item.value(), { album: Object.assign({}, album) });
    return res.status(200).json(o);
});

/**
 * @api {put} /api/picture/:id Update
 * @apiDescription Edit Picture.
 * @apiVersion 0.1.0
 * @apiName PutPicture
 * @apiGroup Picture
 * 
 * @apiParam {string} name
 * 
 * @apiSampleRequest /api/picture/:id
 */
router.put('/:id', validator(joi.object().keys({
    name: joi.string().required()
})), (req, res, next) => {
    const id = req.params.id;
    const model = res.locals.model;
    const now = moment().toISOString();

    let item = db.get('pictures').getById(id);
    if (!item.value())
        return res.status(404).json({ message: 'not found' });

    item
        .assign({
            name: model.name,
            timestamp: now
        }).write();

    return res.status(200).json(Object.assign({ url: `${config.siteUrl}/uploads/${item.value().albumId}/${item.value().id}.${item.value().ext}` }, item.value()));
});

/**
 * @api {delete} /api/picture/:id Delete
 * @apiDescription Delete picture.
 * @apiVersion 0.1.0
 * @apiName DeletePicture
 * @apiGroup Picture
 * 
 * @apiSampleRequest /api/picture/:id
 */
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    let item = db.get('pictures').getById(id);
    if (!item.value())
        return res.status(404).json({ message: 'not found' });

    const p = new Promise((resolve, reject) => {
        fs.unlink(`${config.rootFolder}/uploads/${item.value().albumId}/${item.value().id}.${item.value().ext}`, () => {
            return resolve();
        });
    }).then(() => {
        db.get('pictures').remove({ id: id }).write();
        return res.status(200).json({ removed: true, id: id });
    });
});

module.exports = router;