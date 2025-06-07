import db from "#db/client";

export async function createPlaylist(name, description, ownerId) {
  const sql = `
    INSERT INTO playlists(
      name,
      description,
      owner_id
    )
    VALUES(
      $1,
      $2,
      $3
    )
    RETURNING *;
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, ownerId]);
  return playlist;
}

export async function getPlaylistsByUserId(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE owner_id = $1;
  `;
  const { rows: playlists } = await db.query(sql, [id]);
  return playlists;
}

export async function getPlaylistById(playlistId, id) {
  const sql = `
    SELECT *
    FROM playlists
    WHERE id = $1
      AND owner_id = $2;
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [playlistId, id]);
  return playlist;
}

export async function getPlaylistsWithTrack(trackId, id) {
  const sql = `
    SELECT
      playlists.id,
      playlists.name,
      playlists.description
    FROM
      playlists_tracks
    JOIN playlists
        ON playlists_tracks.playlist_id = playlists.id
    WHERE
      playlists_tracks.track_id = $1
      AND
      playlists.owner_id = $2;
  `;
  const { rows } = await db.query(sql, [trackId, id]);

  return rows;
}
