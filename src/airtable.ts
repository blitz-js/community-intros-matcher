import type { Participant } from "./matcher.ts";

const apiKey = Deno.env.get("AIRTABLE_API_KEY");
const baseId = Deno.env.get("AIRTABLE_BASE_ID");

async function fetchTable<Fields>(table: string) {
  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${table}`,
    {
      headers: {
        Authorization: "Bearer " + apiKey,
      },
    }
  );

  const { records } = await response.json();

  return records as { id: string; fields: Fields }[];
}

export async function fetchParticipants(): Promise<Participant[]> {
  const participants = await fetchTable<{
    Dates?: string[];
    "Discord Name": string;
  }>("Participants");
  const dates = await fetchTable<{ ID: number; Participants?: string[] }>(
    "Dates"
  );

  return participants.map((record) => {
    const { "Discord Name": username, Dates = [] } = record.fields;
    return {
      username,
      dates: Dates.map((dateId) => dates.find((d) => d.id === dateId)!).map(
        (d) => {
          const { Participants = [] } = d.fields;
          const otherOne = Participants.find((p) => p !== record.id)!;
          return {
            username: participants.find((p) => p.id === otherOne)!.fields[
              "Discord Name"
            ],
          };
        }
      ),
    };
  });
}
