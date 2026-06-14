import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: [5, "Name must be contain at leat 5 characters"],
      maxLength: [20, "Name must be contain maximum 20 characters"],
      required: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      minLength: [5, "username must be minunmun 5 characters"],
      maxLength: [20, "username contain maximum 20 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ], // ← ADDED
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        delete ret;
      },
    },
    toObject: { virtuals: true },
  },
);


userSchema.pre( "save", function () {
  if ( !this.isModified( "password" ) ) return

  this.password = await bcrypt.hash(this.password, process.env.PASSWORD_HASH_SLAT) 
} )

userSchema.methods.isPasswordMatched = async function ( entetedPassword ) {
  return await bcrypt.compare(entetedPassword, this.password)
}

userSchema.methods.genrateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY
    , {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY_KEY
    }
  )
}

userSchema.methods.genrateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.evn.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.RFRESH_TOKEN_EXPIRY_KEY
    }
  )
}

userSchema.methods.increaseLoginAttempts = async function () {
  if ( this.lockUntil && this.lockUntil < Date.now() ) {
    return this.updateOne(
      {
        $set: { loginAttempts: 1 },
        $unset:{lockUntil: 1}
      }
    )
  }

  const updates = {$inc: {loginAttempts : 1}}
  const maxAttempts = 5

  if ( this.loginAttempts + 1 >= maxAttempts && !this.lockUntil ) {
    updates.$set= {
      lockUntil: Date.now() + 30 * 60 * 1000
    }
  }

  return this.updateOne(updates)
}

userSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne(
    {
      $set: { loginAttempts: 0 },
      $unset:{lockUntil:1}
    }
  )
}


const User = mongoose.model("User", userSchema);
export default User;
