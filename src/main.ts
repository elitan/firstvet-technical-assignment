import {
  addMinutes,
  areIntervalsOverlapping,
  format,
  parseISO,
} from "date-fns";
import { sv } from "date-fns/locale";
import { getExternalBreakKeys, readJsonFile } from "./utils";

const MEETING_DURATION = 15;
const NUMBER_OF_BREAKS = 4;
const FILE_PATH = "./data.json";

(async () => {
  // read the file
  const schedules = await readJsonFile(FILE_PATH);

  // available slots
  const availableSlots = [];

  for (const schedule of schedules) {
    console.log(schedule);

    // get start and end date and time in correct formats
    const scheduleStartAt = parseISO(
      `${schedule.startDate}T${schedule.startTime}`
    );
    const scheduleEndAt = parseISO(`${schedule.endDate}T${schedule.endTime}`);

    // console.log(format(scheduleStartAt, "yyyy-MM-dd", { locale: sv }));
    // console.log(format(scheduleEndAt, "yyyy-MM-dd", { locale: sv }));

    console.log(format(scheduleStartAt, "yyyy-MM-dd HH:mm "));
    console.log(format(scheduleEndAt, "yyyy-MM-dd HH:mm"));

    // get all breaks
    const breaks = [];
    for (const breakIndex of Array(NUMBER_OF_BREAKS).keys()) {
      const { externalStartBreakKey, externalEndBreakKey } =
        getExternalBreakKeys(breakIndex);

      if (
        schedule[externalStartBreakKey] === "00:00:00" ||
        schedule[externalEndBreakKey] === "00:00:00"
      ) {
        continue;
      }

      breaks.push({
        start: parseISO(
          `${schedule.startDate}T${schedule[externalStartBreakKey]}`
        ),
        end: parseISO(`${schedule.endDate}T${schedule[externalEndBreakKey]}`),
      });
    }

    console.log("available breaks:");
    console.log(breaks);

    const availableSlots = [];

    let dateCursor = scheduleStartAt;
    while (dateCursor < scheduleEndAt) {
      // get current slot start and end time
      const slotStartAt = dateCursor;
      const slotEndAt = addMinutes(dateCursor, MEETING_DURATION);

      // if slot end time is after schedule end time, stop
      if (slotEndAt > scheduleEndAt) {
        break;
      }

      // make sure slot doesn't overlap with any break
      const overlapsWithBreak = breaks.find((breakItem) => {
        return areIntervalsOverlapping(
          { start: slotStartAt, end: slotEndAt },
          breakItem
        );
      });

      // if slot doesn't overlap with any break, add it to available slots
      if (!overlapsWithBreak) {
        availableSlots.push({ start: slotStartAt, end: slotEndAt });
        dateCursor = slotEndAt;
      } else {
        // move cursor to end of the break it overlaps with
        dateCursor = overlapsWithBreak.end;
      }
    }

    console.log("available slots:");
    console.log(availableSlots);
  }
})();
