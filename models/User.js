const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true },
    password: { type: String, required: [true, "Password is required"], select: false },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const bcrypt = require("bcryptjs");
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
