const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/\S+@\S+\.\S+/, 'Invalid email address']
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: 6,
      select:   false
    },
    role: {
      type:    String,
      enum:    ['player', 'admin'],
      default: 'player'
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (plainText) {
  return bcrypt.compare(plainText, this.password);
};

module.exports = mongoose.model('User', UserSchema);