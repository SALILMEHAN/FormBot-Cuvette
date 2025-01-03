const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  name: { type: String, required: true },
  defaultForms: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Form" },
      formname: { type: String, required: true },
    },
  ],
});

const Workspace = new mongoose.model("Workspace", WorkspaceSchema);
module.exports = Workspace;
