const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  foldername: { type: String, required: true },
  forms: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
      formname: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
});

const Folder = new mongoose.model("Folder", FolderSchema);
module.exports = Folder;
