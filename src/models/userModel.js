import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.comparePassword = (password, hashed_password) => {
  return bcrypt.compareSync(password, hashed_password);
};

export default mongoose.model("User", userSchema);
