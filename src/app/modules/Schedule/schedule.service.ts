import {addHours, format} from 'date-fns'
const insertIntoDb = async (payload: any) => {
  const {startDate, endDate, startTime, endTime} = payload;
  const curentDate = new Date(startDate);
  const LastDate = new Date(endDate)
 while (curentDate <=LastDate) {
    const startDateTime = new Date(
        addHours(
            `${format(curentDate,'yyyy-MM-dd')}`,
            Number(startTime.split(":")[0])
        )
    )

    const endDateTime = new Date(
        addHours(
            `${format(LastDate,'yyyy-MM-dd')}`,
            Number(endTime.split(":")[0])
        )
    )
   while (startDate<= endDateTime ) {
    
   }
 }

};

export const scheduleService = {
  insertIntoDb,
};
