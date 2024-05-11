const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageScheme = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true },
  date_of_post: {
    type: Date,
    default: Date.now,
  }
})

MessageScheme.virtual("date_of_post_formated").get(function() {
  return DateTime.fromJSDate(this.date_of_post).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("Message", MessageScheme)
