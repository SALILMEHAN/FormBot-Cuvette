const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  answers: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
  viewCount: { type: Number, default: 0 },
  startCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", ResponseSchema);

module.exports = Response;
