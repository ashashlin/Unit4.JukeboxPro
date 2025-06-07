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

export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}
