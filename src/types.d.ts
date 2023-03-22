export interface Schedule {
  [key: string]: string; // required to dynamically access properties
  scheduleId: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  startBreak: string;
  endBreak: string;
  startBreak2: string;
  endBreak2: string;
  startBreak3: string;
  endBreak3: string;
  startBreak4: string;
  endBreak4: string;
  employeeId: number;
  employeeName: string;
}

export type Schedules = Schedule[];
