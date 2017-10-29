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
const rimraf = require('rimraf');

const mkdir = (path) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, (err, res) => {
            resolve();
        });
    });
};

const readFile = (path, type) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, type, (err, data) => {
            if (err)
                return reject(err);
            return resolve(data);
        });
    });
};

const writeFile = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err, res) => {
            if (err)
                return reject(err);

            return resolve(res);
        });
    });
};

const validateFile = (req, res, next) => {
    if (!(req.files && req.files.pic))
        return res.status(400).json(errorWriter('no file'));

    return next();
};

/**
 * @api {get} /api/album Get All
 * @apiDescription Get all albums.
 * @apiVersion 0.1.0
 * @apiName GetAlbum
 * @apiGroup Album
 * 
 * @apiSampleRequest /api/album
 */
router.get('/', (req, res, next) => {
    const items = db.get('albums').value();

    let o = [];
    items.forEach(x => {
        let pictures = db.get('pictures').filter({ albumId: x.id }).value();

        if (pictures.length > 0) {
            o.push(Object.assign({
                coverUrl: `${config.siteUrl}/uploads/${pictures[0].albumId}/${pictures[0].id}.${pictures[0].ext}`
            }, x));
        }
        else
            o.push(Object.assign({}, x));
    });

    return res.status(200).json(o);
});

/**
 * @api {get} /api/album/:id Get one
 * @apiDescription Get one album.
 * @apiVersion 0.1.0
 * @apiName GetAlbumById
 * @apiGroup Album
 * 
 * @apiSampleRequest /api/album/:id
 */
router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    let item = db.get('albums').getById(id);
    if (!item.value())
        return res.status(404).json({ message: 'not found' });

    let pictures = db.get('pictures').filter({ albumId: id }).value();

    let o = Object.assign({}, item.value());
    o.pictures = [];

    if (pictures.length > 0) {
        o.coverUrl = `${config.siteUrl}/uploads/${pictures[0].albumId}/${pictures[0].id}.${pictures[0].ext}`;
    }

    pictures.forEach(x => {
        let y = Object.assign({ url: `${config.siteUrl}/uploads/${id}/${x.id}.${x.ext}` }, x);
        y.size = undefined;
        y.width = undefined;
        y.height = undefined;
        y.timestamp = undefined;
        y.createdAt = undefined;
        y.ext = undefined;
        o.pictures.push(y);
    });

    return res.status(200).json(o);
});

/**
 * @api {post} /api/album New
 * @apiDescription New Album.
 * @apiVersion 0.1.0
 * @apiName PostAlbum
 * @apiGroup Album
 * 
 * @apiParam {string} name
 * 
 * @apiSampleRequest /api/album
 */
router.post('/', validator(joi.object().keys({
    name: joi.string().required()
})), (req, res, next) => {
    const model = res.locals.model;
    const now = moment().toISOString();

    const item = {
        name: model.name,
        createdAt: now,
        timestamp: now
    };
    db.get('albums')
        .insert(item).write();

    mkdir(`${config.rootFolder}/uploads/${item.id}`)
        .then(() => {

            return res.status(200).json(item);
        })
        .catch(httpCatch(res, next));
});

/**
 * @api {put} /api/album/:id Update
 * @apiDescription Edit Album.
 * @apiVersion 0.1.0
 * @apiName PutAlbum
 * @apiGroup Album
 * 
 * @apiParam {string} name
 * 
 * @apiSampleRequest /api/album/:id
 */
router.put('/:id', validator(joi.object().keys({
    name: joi.string().required()
})), (req, res, next) => {
    const id = req.params.id;
    const model = res.locals.model;
    const now = moment().toISOString();

    let item = db.get('albums').getById(id);
    if (!item.value())
        return res.status(404).json({ message: 'not found' });

    item
        .assign({
            name: model.name,
            timestamp: now
        }).write();

    return res.status(200).json(item);
});

/**
 * @api {post} /api/album/:id/picture New
 * @apiDescription Add a new picture to an album
 * @apiVersion 0.1.0
 * @apiName PostAlbumPicture
 * @apiGroup Picture
 * 
 * @apiParam {string} name
 * @apiParam {file} pic
 */
router.post('/:id/picture', validateFile, validator(joi.object().keys({
    name: joi.string().required()
})), (req, res, next) => {
    const file = req.files.pic;
    let extension = file.name.split('.').pop();

    const id = req.params.id;
    const model = res.locals.model;
    const now = moment().toISOString();

    let album = db.get('albums').getById(id);
    if (!album.value())
        return res.status(404).json({ message: 'not found' });

    let newPicture = {
        albumId: id,
        name: model.name,
        ext: extension,
        createdAt: now,
        timestamp: now
    };

    db.get('pictures')
        .insert(newPicture).write();

    album
        .assign({
            timestamp: now
        }).write();

    new Promise((resolve, reject) => {
        file.mv(`${config.rootFolder}/uploads/${id}/${newPicture.id}.${extension}`, (err) => {
            if (err)
                return reject(err);
            return resolve();
        });
    }).then(() => {
        let size = sizeOf(`${config.rootFolder}/uploads/${id}/${newPicture.id}.${extension}`);
        db.get('pictures').getById(newPicture.id)
            .assign({ width: size.width, height: size.height, size: file.data.length }).write();

        return res.status(200).json(Object.assign(
            { url: `${config.siteUrl}/uploads/${id}/${newPicture.id}.${newPicture.ext}` },
            newPicture)
        );
    }).catch(httpCatch(res, next));
});

/**
 * @api {delete} /api/album/:id Delete
 * @apiDescription Delete album.
 * @apiVersion 0.1.0
 * @apiName DeleteAlbum
 * @apiGroup Album
 * 
 * @apiSampleRequest /api/album/:id
 */
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    let item = db.get('albums').getById(id);
    if (!item.value())
        return res.status(404).json({ message: 'not found' });

    db.get('pictures').remove({ albumId: id }).write();

    rimraf(`${config.rootFolder}/uploads/${id}`, () => {
        db.get('albums').remove({ id: id }).write();
        return res.status(200).json({ removed: true, id: id });
    });
});

module.exports = router;