import mongoose from "mongoose";

// 1st: need to create schema
// 2nd: create a model based based of that schema

const noteSchema = new mongoose.Schema({
    title:{
      type: String,
      required: true,
    },
    content:{
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true}
);


const Note = mongoose.model("Note", noteSchema)

export default Note;