const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  formname: { type: String, required: true },
  fields: [],
  createdAt: { type: Date, default: Date.now },
});

const Form = new mongoose.model("Form", FormSchema);
module.exports = Form;
