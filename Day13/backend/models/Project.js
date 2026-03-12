import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: String, // Was 'title' before, but controller uses 'name'
    description: String,
    techStack: String,

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    }
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
