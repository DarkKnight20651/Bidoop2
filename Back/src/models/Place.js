import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [long, lat]
    },
    category: { type: String, enum: ["event", "shop", "donation", "place"], required: true },
    images: [String],
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: Number }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);
export default Place;
