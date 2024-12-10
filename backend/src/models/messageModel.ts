import mongoose, { Schema } from "mongoose";


const messageSchema = new mongoose.Schema(
  {
    userID: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    message: { type: String}
  },
  { timestamps: true }
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
