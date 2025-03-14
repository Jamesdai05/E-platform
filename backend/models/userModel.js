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

// before saving to database, hash the password.
userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    next();
  }

  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)

})

const User = mongoose.model('User', userSchema)
export default User;