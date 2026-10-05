import mongoose from "mongoose";

// Length limits mirror Backend/validation.js (defense in depth).
const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, maxlength: 50000 },
    tags: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
      validate: [(arr) => arr.length <= 20, "A note can have at most 20 tags"],
    },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    color: {
      type: String,
      enum: ["default", "amber", "emerald", "sky", "purple", "rose", "orange"],
      default: "default",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", NoteSchema);
