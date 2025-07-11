import { faker } from "@faker-js/faker";
import db from "#db/client";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // order matters - seed users first bc playlists depends on it
  for (let i = 1; i <= 2; i++) {
    const username = faker.internet.username();
    const password = faker.internet.password();

    console.log(username, password);

    await createUser(username, password);
  }

  for (let i = 1; i <= 10; i++) {
    await createPlaylist(
      "Playlist " + i,
      "lorem ipsum playlist description",
      1
    );
  }

  for (let i = 11; i <= 20; i++) {
    await createPlaylist(
      "Playlist " + i,
      "lorem ipsum playlist description",
      2
    );
  }

  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }
}
