import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res
        .status(400)
        .json({ message: "Unauthorised! Try signing In or signing Up." });

    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWTSECRET);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong. Please, try again later..." });
  }
};

export default auth;
