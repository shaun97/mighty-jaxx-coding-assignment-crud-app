const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

SALT = 10;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: { unique: true },
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre("save", async function (next) {
    var user = this;
    if (!user.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, SALT);
    next();
});

userSchema.methods.checkPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
