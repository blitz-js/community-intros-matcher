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
  const allParticipants = await fetchTable<{
    Dates?: string[];
    "Discord Name": string;
    Inactive: boolean;
  }>("Participants");
  const dates = await fetchTable<{ ID: number; Participants?: string[] }>(
    "Dates"
  );

  function findById<T extends { id: string }>(items: T[], id: string): T {
    return items.find((v) => v.id === id)!;
  }
  const findDateById = (id: string) => findById(dates, id);
  const findParticipantById = (id: string) => findById(allParticipants, id);

  const activeParticipants = allParticipants.filter((p) => !p.fields.Inactive);
  const participants = activeParticipants;

  return participants.map((record) => {
    const { "Discord Name": username, Dates = [] } = record.fields;

    return {
      username,
      dates: Dates.map(findDateById).map((d) => {
        if (!d.fields.Participants) {
          throw new Error("Date w/o Participants!");
        }
        const [first, second] = d.fields.Participants;
        const otherOne = first === record.id ? second : first;
        return {
          username: findParticipantById(otherOne).fields["Discord Name"],
        };
      }),
    };
  });
}
