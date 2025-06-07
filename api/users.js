import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import express from "express";

const usersRouter = express.Router();

// POST /users/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    // assuming req.body always exists
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send(
          "Error: please include both username and password in the request body."
        );
    }

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
    // assuming req.body always exists
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send(
          "Error: please include both username and password in the request body."
        );
    }

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
