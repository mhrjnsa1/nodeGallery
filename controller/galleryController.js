const express = require("express");
const GalleryModels = require("../GalleryModels/Gallery");
const fs = require("fs");
const path = require("path");
const Pdfgenerate = require("pdfkit");
exports.viewGallery = (req, res, next) => {
  GalleryModels.findOne().then((result) => {
    if (result) {
      res.render("showGallery", {
        username: result.name,
        _id: result._id,
        galleryCollection: result.image,
        galleryLength: result.image.length,
      });
    } else {
      res.render("showGallery", {
        galleryLength: 0,
      });
    }
  });
};
exports.removeImage = (req, res, next) => {
  const id = req.body.id;
  const imageId = req.body.imageId;
  if (id) {
    GalleryModels.findById(id)
      .then((result) => {
        console.log(result);
        if (result) {
          const filterImages = result.image.filter((list) => {
            return list != imageId;
          });
          result.image = filterImages;
          return result.save();
        }
      })
      .then((result) => {
        if (result) {
          console.log(imageId);
          fs.unlink(imageId, (err) => {
            if (err) throw err;
          });
          res.redirect("/showGallery");
        } else {
          res.redirect("/showGallery");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.editImageView = (req, res, next) => {
  const id = req.params.id;
  const imageId = req.params.imageId;
  GalleryModels.findById(id)
    .then((result) => {
      const getUpdateImage = result.image[imageId];
      console.log(getUpdateImage);
      if (getUpdateImage) {
        let warning = req.flash("warning");

        if (warning.length > 0) {
          warning = warning[0];
        } else {
          warning = null;
        }
        res.render("updateImage", {
          id: id,
          response: result,
          imagePath: getUpdateImage,
          message: warning,
        });
      } else {
        res.redirect("/showGallery");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.updateEditImage = (req, res, next) => {
  const getImage = req.files;
  const getId = req.body._id;
  const existinImage = req.body.existinImage;

  GalleryModels.findById(getId)
    .then((result) => {
      if (!result) {
        res.redirect("/showGallery");
      } else {
        const updateImageList = result.image.map((list) => {
          if (list.toString() == existinImage.toString()) {
            list = getImage[0].path;
          }
          return list;
        });
        result.image = updateImageList;
        return result.save();
      }
    })
    .then((success) => {
      req.flash("warning", "successgully you have updated the image");
      res.redirect("/showGallery");
    })
    .catch((error) => {
      console.log(error);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.uploadView = (req, res, next) => {
  let message = req.flash("message");
  console.log(message);
  if (message.length == 0) {
    message = "";
  } else {
    message = message[0];
  }
  res.render("fileUpload", { message: message });
};

exports.postFileUpload = (req, res, next) => {
  console.log(req.files);
  if (!req.files) {
    req.flash("message", "Please upload valid image type");
  } else {
    GalleryModels.findOne()
      .then((result) => {
        if (!result) {
          let imageCollectionPath = [];
          req.files.forEach((list) => {
            imageCollectionPath.push(list.path);
          });
          const gallerySave = new GalleryModels({
            name: "maharajan",
            image: imageCollectionPath,
          });
          gallerySave.save().then((success) => {
            req.flash("message", "file uploaded successfully,upload again");
            res.redirect("/showGallery");
          });
        } else {
          req.files.forEach((list) => {
            result.image.push(list.path);
          });
          return result.save();
        }
      })
      .then((result) => {
        res.redirect("/showGallery");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.downloadDocument = (req, res, next) => {
  const documentPath = path.join("documents", "document.pdf");
  const pdfGenerateCtr = new Pdfgenerate();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline;filename="document.pdf"');
  //   file.pipe(res);
  pdfGenerateCtr.pipe(fs.createWriteStream(documentPath));
  pdfGenerateCtr.pipe(res);
  // Measure the text

  GalleryModels.findOne()
    .then((result) => {
      pdfGenerateCtr
        .fontSize(26)
        .fillColor("red")
        .text(result.name + " Gallery", {
          underline: true,
          align: "center",
        });
      result.image.forEach((list, index) => {
        if (index == 0) {
          pdfGenerateCtr.image(list, 60, 0, {
            fit: [500, 500],
            valign: "center",
            align: "center",
          });
        } else {
          pdfGenerateCtr.addPage().image(list, 60, 0, {
            fit: [500, 500],

            align: "center",
            valign: "center",
          });
        }
      });
      pdfGenerateCtr.end();
    })
    .catch((error) => {
      console.log(error);
    });
};
