import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/user.js";

export const signUp = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } =
    await req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User exists. If user, try signin up..." });

    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ message: "Password do not match. Please try again." });
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      process.env.JWTSECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          email: existingUser.email,
          id: existingUser._id,
        },
        process.env.JWTSECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        result: existingUser,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
