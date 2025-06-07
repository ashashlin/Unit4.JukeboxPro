import express from "express";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylistsByUserId,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

const router = express.Router();

// rough flow - check if user has an access token, if not, send 401 unauthorized. if they do, verify the token. if invalid, throws an error and send 401. if valid, get the user from db, set req.user = user, and then go to requireUser
router.use(getUserFromToken);
router.use(requireUser);

// GET /playlists
// POST /playlists
router
  .route("/")
  .get(async (req, res) => {
    const { id } = req.user;
    const playlists = await getPlaylistsByUserId(id);
    res.send(playlists);
  })
  .post(requireBody(["name", "description"]), async (req, res) => {
    const { id } = req.user;
    const { name, description } = req.body;

    const playlist = await createPlaylist(name, description, id);
    res.status(201).send(playlist);
  });

// id here (the 4th param) is the id value in req.params, which is the playlist id
router.param("id", async (req, res, next, id) => {
  const userId = req.user.id;
  const playlist = await getPlaylistById(id, userId);

  if (!playlist) return res.status(403).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

// GET /playlists/:id
router.route("/:id").get(async (req, res) => {
  res.send(req.playlist);
});

// GET /playlists/:id/tracks
// POST /playlists/:id/tracks
router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(requireBody(["trackId"]), async (req, res) => {
    const { trackId } = req.body;

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });

export default router;
