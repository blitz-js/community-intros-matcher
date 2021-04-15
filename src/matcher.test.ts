import { matchParticipants } from "./matcher.ts";
import { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts";

Deno.test("simple case", () => {
  assertEquals(
    matchParticipants([
      {
        username: "a",
        dates: [],
      },
      {
        username: "b",
        dates: [],
      },
    ]),
    {
      pairs: [["a", "b"]],
      unpairable: [],
    }
  );

  assertEquals(
    matchParticipants([
      {
        username: "a",
        dates: [
          {
            username: "b",
          },
        ],
      },
      {
        username: "b",
        dates: [
          {
            username: "a",
          },
        ],
      },
      {
        username: "c",
        dates: [
          {
            username: "b",
          },
        ],
      },
    ]),
    {
      pairs: [["a", "c"]],
      unpairable: ["b"],
    }
  );

  assertEquals(
    matchParticipants([
      {
        username: "a",
        dates: [
          {
            username: "b",
          },
        ],
      },
      {
        username: "b",
        dates: [
          {
            username: "a",
          },
        ],
      },
      {
        username: "c",
        dates: [
          {
            username: "b",
          },
        ],
      },
    ]),
    {
      pairs: [["a", "c"]],
      unpairable: ["b"],
    }
  );
});
