import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../../shared/prisma";
const insertIntoDb = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const curentDate = new Date(startDate); // start Date
  const LastDate = new Date(endDate); // end Date

  const interValTime = 30;
  const schedule =[];
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
      const result = await prisma.schedule.create({
        data:scheduleData
      })

      schedule.push(result)
      startDateTime.setMinutes(startDateTime.getMinutes()+interValTime)
    }
    
    curentDate.setDate(curentDate.getDate()+1);

  }
  return schedule
};

export const scheduleService = {
  insertIntoDb,
};
