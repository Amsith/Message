import mongoose, { Schema } from "mongoose";


const messageSchema = new mongoose.Schema(
  {
    senderID: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    receiverID: { type: Schema.Types.ObjectId, required: true},
    message: { type: String}
  },
  { timestamps: true }
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
