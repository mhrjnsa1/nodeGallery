const express = require("express");
const route = express.Router();
const GalleryModels = require("../GalleryModels/Gallery");
const controller = require("../controller/galleryController");
route.get("/gallery", controller.viewGallery);
route.post("/deleteImage", controller.removeImage);
route.get("/replaceImage/:id/:imageId", controller.editImageView);
route.post("/replacePostImage", controller.updateEditImage);
route.get("/fileUpload", controller.uploadView);
route.post("/fileUploadPost", controller.postFileUpload);
route.get("/downloadDocument", controller.downloadDocument);

module.exports = route;
