const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET 



async function register(req, res) {
    try {
        const { name, email, mobile, password } = req.body;
        // console.log(req.body);


        const existingUser = await User.findOne({ $or: [{ email }, { mobile }], });
        // console.log(existingUser);


        if (existingUser) {
            return res.status(400).json({
                status: "Failed",
                message: "User with this email or mobile already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: "user",
        });
        // console.log(user);
        let data = await user.save();

        return res.status(201).json({
            status: "success",
            message: "User registration successful",
            data: data,
        });
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message,
        });
    }
}


async function login(req, res) {
    try {
        const { loginId, password } = req.body;

        if (!loginId) {
            return res.status(400).json({
                status: "Failed",
                message: "For login, either mobile or email is required"
            });
        }

        const user = await User.findOne({
            $or: [{ email:loginId }, { mobile:loginId }],
        });

        if (!user) {
            return res.status(400).json({
                status: "Failed",
                message: "User not found",
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid password",
            });
        }
        const token = jwt.sign({ user_id: user._id, email: user.email }, secret_key, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
        });

        return res.status(200).json({
            status: "Success",
            message: "Login successful",
            token:token
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message,
        });
    }
}
async function getMe(req, res) {
    try {
        const user = req.user.toObject();
        delete user.password;
        return res.status(200).json({
            status: "Success",
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message,
        });
    }
}

module.exports = { register, login, getMe }