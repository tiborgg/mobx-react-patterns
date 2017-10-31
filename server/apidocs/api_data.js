define({ "api": [
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
    "url": "/api/picture",
    "title": "New",
    "description": "<p>New Picture.</p>",
    "version": "0.1.0",
    "name": "PostPicture",
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
    "filename": "api/v1/pictureController.js",
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
