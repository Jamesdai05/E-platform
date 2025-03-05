import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// since we use this key word here, the function declaration should be used.
userSchema.methods.matchPassword=async function(inputPassword){
  return await bcrypt.compare(inputPassword,this.password)
}

const User = mongoose.model('User', userSchema)
export default User;