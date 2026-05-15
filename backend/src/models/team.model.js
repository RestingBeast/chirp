import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

teamSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const teamId = doc._id;
    await mongoose.model("Standup").deleteMany({ teamId });
    await mongoose.model("Digest").deleteMany({ teamId });
  }
});

export default mongoose.model("Team", teamSchema);
