const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserScheme = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true },
  password: { type: String, required: true },
  mem_status: {
    type: String,
    enum: ["member", "admin"],
    default: "member",
  },
})

UserScheme.virtual("name").get(function() {
  if (this.first_name && this.last_name) {
    return `${this.first_name} ${this.last_name}`;
  }

  return "";
})

module.exports = mongoose.model("User", UserScheme);
