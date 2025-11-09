import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    category: {
      type: String,
      enum: ["event", "shop", "donation", "place"],
      required: true
    },
    images: [String],
    ratings: [
      { user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: Number }
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// 🗺️ Índice geoespacial obligatorio
placeSchema.index({ "location": "2dsphere" });

const Place = mongoose.model("Place", placeSchema);
export default Place;
