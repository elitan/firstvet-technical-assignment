# FirstVet Technical Assignment

## Improvements

- API
  - `shceduleId` could be renamed to `id` as this is presumably an array of `schedule`.
  - `[start|end]Date` can be combined in a single `[start|end]At` with combined date and time.
  - Breaks should:
    1. Include date and time.
    2. Be an array: `breaks: [{startAt: '2023-03-22T08:00:00+00:00', endAt: '2023-03-22T08:00:00+00:00'}]` to avoide `00:00:00` entries and allowm more than 4 breaks, making the system more dynamic.
  - All date time fields should be in ISO 8601 format (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).
- What if start is some odd time, ex 18:55. Then it's not good to keep adding 15 mins based on the start. Then we need to reset the cursor after every break to start at the break end.

---

## Task

At FirstVet, working schedules for veterinarians are sometimes managed in an external workforce scheduling tool and brought into FirstVet via an integration.
In this hypothetical scenario, we want to integrate with such a tool. This third-party tool exposes a file based API where schedules are defined in files on the following JSON format:

```json
[
  {
    "scheduleId": 4711,
    "startDate": "2020-04-29",
    "startTime": "10:00:00",
    "endDate": "2020-04-29",
    "endTime": "14:30:00",
    "startBreak": "12:00:00",
    "endBreak": "12:30:00",
    "startBreak2": "00:00:00",
    "endBreak2": "00:00:00",
    "startBreak3": "00:00:00",
    "endBreak3": "00:00:00",
    "startBreak4": "00:00:00",
    "endBreak4": "00:00:00",
    "employeeId": 4712,
    "employeeName": "John Doe"
  },
  {
    "scheduleId": 4713,
    "startDate": "2020-04-29",
    "startTime": "10:00:00",
    "endDate": "2020-04-29",
    "endTime": "16:35:00",
    "startBreak": "10:30:00",
    "endBreak": "12:30:00",
    "startBreak2": "16:00:00",
    "endBreak2": "16:15:00",
    "startBreak3": "00:00:00",
    "endBreak3": "00:00:00",
    "startBreak4": "00:00:00",
    "endBreak4": "00:00:00",
    "employeeId": 4714,
    "employeeName": "Jane Doe"
  },
  {
    "scheduleId": 4715,
    "startDate": "2020-04-29",
    "startTime": "18:00:00",
    "endDate": "2020-04-29",
    "endTime": "22:10:00",
    "startBreak": "19:00:00",
    "endBreak": "19:30:00",
    "startBreak2": "00:00:00",
    "endBreak2": "00:00:00",
    "startBreak3": "00:00:00",
    "endBreak3": "00:00:00",
    "startBreak4": "00:00:00",
    "endBreak4": "00:00:00",
    "employeeId": 4714,
    "employeeName": "Jane Doe"
  }
]
```

In this particular example, the file contains three schedules. The first one, with scheduleId 4711, is for the veterinarian John Doe, starts at 2020-04-29 10:00 and ends at 2020-04-29 14:30. In this schedule, one break is also defined, between 12:00 and 12:30. There can be up to four breaks in a single schedule. During a break, the veterinarian is not available for meetings. Breaks where both the start and end time are defined as `00:00:00`should be ignored. There can be many schedules for the same veterinarian in a single file.

A meeting with a veterinarian is 15 minutes long. A new meeting can start right after the previous one. However, a meeting is not allowed to span past the schedule’s end time. For example, a schedule between 10:00 and 11:05 can only contain 4 meeting slots.

Your task is to write a tool, using either PHP or JavaScript/TypeScript, that parses a file containing a list of schedules, splits each schedule into 15 minute long meeting slots (remember to consider breaks) and then outputs a list of available 15 minute meeting slots that can be booked by an animal owner. The list should be sorted by the time of the meeting slot.

For example:

```
2020-04-29 10:00 - 10:15 Jane Doe
2020-04-29 10:00 - 10:15 John Doe
2020-04-29 10:15 - 10:30 Jane Doe
2020-04-29 10:15 - 10:30 John Doe
2020-04-29 10:30 - 10:45 John Doe
2020-04-29 10:45 - 11:00 John Doe
```

Good luck!
