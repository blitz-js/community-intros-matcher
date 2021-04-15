export interface Participant {
  username: string;
  dates: { username: string }[];
}

function minus(a: string[], b: string[]) {
  return a.filter((v) => !b.includes(v));
}

export function matchParticipants(
  users: Participant[]
): { pairs: [a: string, b: string][]; unpairable: string[] } {
  const unavailableUsers: string[] = [];
  const unpairable: string[] = [];
  const pairs: [a: string, b: string][] = [];

  const allUsernames = users.map((u) => u.username);

  for (const { username, dates } of users) {
    if (unavailableUsers.includes(username)) {
      continue;
    }

    const alreadyDated = dates.map((d) => d.username).concat([username]);
    const openToDate = minus(allUsernames, unavailableUsers);
    const potentialDates = minus(openToDate, alreadyDated);
    const date = potentialDates[0];
    if (date) {
      pairs.push([username, date]);
      unavailableUsers.push(username, date);
    } else {
      unpairable.push(username);
      unavailableUsers.push(username);
    }
  }

  return { unpairable, pairs };
}
