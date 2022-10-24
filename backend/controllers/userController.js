const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPR,
    });
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create({
            email: req.query.email,
            password: req.query.password,
        });

        const token = signToken(newUser._id);

        res.status(200).json({
            status: "success",
            token,
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        // check if token is there
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw "Please log in";
        }

        // validate the token
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );

        next();
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.query;

        // check if email and password exist
        if (!email || !password) {
            res.status(400).json({
                status: "fail",
                message: "Please input email or password",
            });
            return;
        }

        // check if user exist and password correct
        const user = await User.findOne({ email: email });

        if (!user || !(await user.checkPassword(password))) {
            res.status(403).json({
                status: "fail",
                message: "Incorrect email or password",
            });
            return;
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: "success",
            token,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
};
