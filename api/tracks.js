import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsWithTrack } from "#db/queries/playlists";

const router = express.Router();

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.get(
  "/:id/playlists",
  getUserFromToken,
  requireUser,
  async (req, res) => {
    const trackId = req.params.id;
    const { id } = req.user;

    const playlists = await getPlaylistsWithTrack(trackId, id);
    res.send(playlists);
  }
);

export default router;
