const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      requried: true,
      unique: true,
    },
    password: {
      type: String,
      requried: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    sharedWorkspaces: [
      {
        workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
        accesslevel: { type: String, enum: ["view", "edit"], required: true },
      },
    ],
  },
  { timestamps: true }
);

const User = new mongoose.model("User", Userschema);

module.exports = User;
