const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { sendVerificationMail } = require("../utils/sendmail");

const handleServerError = (err, res, statusCode, Message) => {
  console.log(err);
  return res.status(statusCode).json({
    message: Message,
  });
};

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(502).json({
        message: "Please fillup the required fields",
      });
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(403).json({
        message: "User already exists",
      });
    }

    if (password.length < 8) {
      return res.status(502).json({
        message: "Password must be atleast 8 characters",
      });
    }

    const newUser = await new User({
      fullName,
      email,
      password,
    });

    const savedUser = await newUser.save();

    const emailToken = jwt.sign(
      { _id: savedUser._id },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const url = `http://localhost:5000/api/v1/auth/verify/${emailToken}`;

    sendVerificationMail(email, url);

    res.status(200).json({
      message: "Signup successful",
      savedUser,
      emailToken,
    });
  } catch (err) {
    handleServerError(err, res, 500, "Something went wrong. Please try again!");
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(502).json({
        message: "Please fillup the required fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User doesn't exist",
      });
    }

    let token;

    if (user.authenticate(password)) {
      token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
    }

    res.status(200).json({
      token,
      verified: user.verified,
    });
  } catch (err) {
    handleServerError(err, res, 500, "Something went wrong. Please try again!");
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);

    await User.findByIdAndUpdate({ _id: _id }, { verified: true });

    res.status(200).json({
      message: "verified",
    });
  } catch (err) {
    handleServerError(err, res, 500, "Something went wrong. Please try again!");
  }
};

exports.sendVerifyUserMail = async (req, res) => {
  try {
    const emailToken = jwt.sign(
      { _id: req.user._id },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const user = await User.findById({ _id: req.user._id }).select("email");

    const url = `http://localhost:5000/api/v1/auth/verification/${emailToken}`;

    sendVerificationMail(user.email, url);

    res.status(200).json({
      message: "Email sent!",
    });
  } catch (err) {
    handleServerError(err, res, 500, "Something went wrong. Please try again!");
  }
};
