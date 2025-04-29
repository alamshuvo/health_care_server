import { addHours, addMinutes, format } from "date-fns";
const insertIntoDb = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const curentDate = new Date(startDate); // start Date
  const LastDate = new Date(endDate); // end Date

  const interValTime = 30;
  while (curentDate <= LastDate) {
    const startDateTime = new Date(
      addHours(
        `${format(curentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );

    const endDateTime = new Date(
      addHours(
        `${format(curentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );
    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interValTime),
      };
    }
  }
};

export const scheduleService = {
  insertIntoDb,
};
