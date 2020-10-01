const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GalleryModels = new Schema({
  name: {
    type: String,
  },
  image: {
    type: [String],
  },
});

module.exports = mongoose.model("GalleryCollection", GalleryModels);
