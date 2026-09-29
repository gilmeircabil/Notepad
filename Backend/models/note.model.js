import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    color: { type: String, default: "default" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", NoteSchema);
