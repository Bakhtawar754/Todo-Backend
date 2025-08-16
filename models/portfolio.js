import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can only have one portfolio
    },
    name: { type: String, required: true },
    skills: { type: String, default: "" },  
    github: { type: String, default: "" },  
  },
  { timestamps: true }
);

portfolioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Portfolio", portfolioSchema);


