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

  const availableSlots = [];

  // loop through all schedules
  for (const schedule of schedules) {
    const { scheduleId, employeeId, employeeName } = schedule;

    // get start and end date and time in correct formats
    const scheduleStartAt = parseISO(
      `${schedule.startDate}T${schedule.startTime}`
    );
    const scheduleEndAt = parseISO(`${schedule.endDate}T${schedule.endTime}`);

    // get all breaks
    const breaks = [];
    const ZERO_TIME = "00:00:00";
    for (let i = 0; i < NUMBER_OF_BREAKS; i++) {
      const { externalStartBreakKey, externalEndBreakKey } =
        getExternalBreakKeys(i);

      // skip unused breaks
      if (
        schedule[externalStartBreakKey] === ZERO_TIME ||
        schedule[externalEndBreakKey] === ZERO_TIME
      ) {
        continue;
      }

      // get correct start and end date in correct format
      const start = parseISO(
        `${schedule.startDate}T${schedule[externalStartBreakKey]}`
      );
      const end = parseISO(
        `${schedule.endDate}T${schedule[externalEndBreakKey]}`
      );

      // add break to breaks
      breaks.push({
        start,
        end,
      });
    }

    // calculate available slots
    let dateCursor = scheduleStartAt;

    while (dateCursor < scheduleEndAt) {
      // get current slot start and end date and time
      const slotStartAt = dateCursor;
      const slotEndAt = addMinutes(dateCursor, MEETING_DURATION);

      // if slot end time is after schedule end time, stop
      if (slotEndAt > scheduleEndAt) {
        break;
      }

      // check if slot overlaps with any break
      const overlapsWithBreak = breaks.find((breakItem) => {
        return areIntervalsOverlapping(
          { start: slotStartAt, end: slotEndAt },
          breakItem
        );
      });

      // if slot doesn't overlap with any break, add it to available slots
      if (!overlapsWithBreak) {
        // add slot to available slots
        availableSlots.push({
          start: slotStartAt,
          end: slotEndAt,
          scheduleId,
          employeeId,
          employeeName,
        });

        // move cursor to end of the slot
        dateCursor = slotEndAt;
      } else {
        // move cursor to end of the break it overlaps with
        dateCursor = overlapsWithBreak.end;
      }
    }
  }

  // sort available slots by start time
  availableSlots.sort((a, b) => a.start.getTime() - b.start.getTime());

  // print available slots
  for (const slot of availableSlots) {
    console.log(
      `${format(slot.start, "yyyy-MM-dd HH:mm", { locale: sv })} - ${format(
        slot.end,
        "HH:mm",
        { locale: sv }
      )} ${slot.employeeName} (${slot.employeeId})`
    );
  }
})();
