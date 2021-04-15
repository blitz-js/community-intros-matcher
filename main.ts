import { fetchParticipants } from "./src/airtable.ts";
import { matchParticipants } from "./src/matcher.ts";

addEventListener("fetch", async (event) => {
  const participants = await fetchParticipants();
  const newPairs = matchParticipants(participants);

  event.respondWith(new Response(JSON.stringify(newPairs)));
});
