define({ "api": [
  {
    "type": "delete",
    "url": "/api/album/:id",
    "title": "Delete",
    "description": "<p>Delete album.</p>",
    "version": "0.1.0",
    "name": "DeleteAlbum",
    "group": "Album",
    "sampleRequest": [
      {
        "url": "/api/album/:id"
      }
    ],
    "filename": "api/v1/albumController.js",
    "groupTitle": "Album"
  },
  {
    "type": "get",
    "url": "/api/album",
    "title": "Get All",
    "description": "<p>Get all albums.</p>",
    "version": "0.1.0",
    "name": "GetAlbum",
    "group": "Album",
    "sampleRequest": [
      {
        "url": "/api/album"
      }
    ],
    "filename": "api/v1/albumController.js",
    "groupTitle": "Album"
  },
  {
    "type": "get",
    "url": "/api/album/:id",
    "title": "Get one",
    "description": "<p>Get one album.</p>",
    "version": "0.1.0",
    "name": "GetAlbumById",
    "group": "Album",
    "sampleRequest": [
      {
        "url": "/api/album/:id"
      }
    ],
    "filename": "api/v1/albumController.js",
    "groupTitle": "Album"
  },
  {
    "type": "post",
    "url": "/api/album",
    "title": "New",
    "description": "<p>New Album.</p>",
    "version": "0.1.0",
    "name": "PostAlbum",
    "group": "Album",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": ""
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/api/album"
      }
    ],
    "filename": "api/v1/albumController.js",
    "groupTitle": "Album"
  },
  {
    "type": "put",
    "url": "/api/album/:id",
    "title": "Update",
    "description": "<p>Edit Album.</p>",
    "version": "0.1.0",
    "name": "PutAlbum",
    "group": "Album",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": ""
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/api/album/:id"
      }
    ],
    "filename": "api/v1/albumController.js",
    "groupTitle": "Album"
  },
  {
    "type": "delete",
    "url": "/api/picture/:id",
    "title": "Delete",
    "description": "<p>Delete picture.</p>",
    "version": "0.1.0",
    "name": "DeletePicture",
    "group": "Picture",
    "sampleRequest": [
      {
        "url": "/api/picture/:id"
      }
    ],
    "filename": "api/v1/pictureController.js",
    "groupTitle": "Picture"
  },
  {
    "type": "get",
    "url": "/api/picture",
    "title": "Get All",
    "description": "<p>Get all Pictures.</p>",
    "version": "0.1.0",
    "name": "GetPicture",
    "group": "Picture",
    "sampleRequest": [
      {
        "url": "/api/picture"
      }
    ],
    "filename": "api/v1/pictureController.js",
    "groupTitle": "Picture"
  },
  {
    "type": "get",
    "url": "/api/picture/:id",
    "title": "Get one",
    "description": "<p>Get one picture.</p>",
    "version": "0.1.0",
    "name": "GetPictureById",
    "group": "Picture",
    "sampleRequest": [
      {
        "url": "/api/picture/:id"
      }
    ],
    "filename": "api/v1/pictureController.js",
    "groupTitle": "Picture"
  },
  {
    "type": "post",
    "url": "/api/album/:id/picture",
    "title": "New",
    "description": "<p>Add a new picture to an album</p>",
    "version": "0.1.0",
    "name": "PostAlbumPicture",
    "group": "Picture",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "pic",
            "description": ""
          }
        ]
      }
    },
    "filename": "api/v1/albumController.js",
    "groupTitle": "Picture"
  },
  {
    "type": "put",
    "url": "/api/picture/:id",
    "title": "Update",
    "description": "<p>Edit Picture.</p>",
    "version": "0.1.0",
    "name": "PutPicture",
    "group": "Picture",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": ""
          }
        ]
      }
    },
    "sampleRequest": [
      {
        "url": "/api/picture/:id"
      }
    ],
    "filename": "api/v1/pictureController.js",
    "groupTitle": "Picture"
  }
] });
