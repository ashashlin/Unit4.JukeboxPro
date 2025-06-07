import express from "express";
import requireBody from "#middleware/requireBody";
import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";

const usersRouter = express.Router();

// apply this middleware to all routes below
usersRouter.use(requireBody(["username", "password"]));

// POST /users/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const payload = { id: user.id };
    const accessToken = createToken(payload);

    res.status(201).send({ accessToken });
  } catch (error) {
    next(error);
  }
});

// POST /users/login
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username, password);

    if (!user)
      return res.status(401).send("Error: invalid username or password.");

    // if credentials have been verified, we send an access token to the authenticated user
    const payload = { id: user.id };
    const accessToken = createToken(payload);
    res.send({ accessToken });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
