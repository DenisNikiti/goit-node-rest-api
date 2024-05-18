import jwt, { decode } from "jsonwebtoken";
import Users from "../../models/Users";
async function auth(req, res, next) {
  const authtoken = req.headers.authorization;

  if (typeof authtoken === "undefined") {
    return res.status(401).send({
      message: "Not authorized",
    });
  }

  const [bearer, token] = authtoken.split("", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({
      message: "Invalid token",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({
        message: "Invalid token",
      });
    }
  });

  const user = await Users.findById(decode.id);
  if (user === null) {
    return res.status(401).send("Inlavid Token");
  }

  if (user.token !== token) {
    return res.status(401).send("Inlavid Token");
  }
  req.user = {
    id: decode.id,
    email: decode.email,
  };
  next();
}

export default auth;
