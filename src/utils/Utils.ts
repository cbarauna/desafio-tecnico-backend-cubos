export function checkExists(startInterval: Array<any>, endInterval: Array<any>): boolean {
  let intervalReturn;

  startInterval.forEach(data => {
    intervalReturn = findHour(data, endInterval);

  })

  return intervalReturn;
}

function findHour(initA: any, initB: Array<any>): boolean {
  let findHourReturn = false;
  initB.forEach((element) => {
    if (initA.start == element.start && initA.end == element.end) {
      findHourReturn = true;
    }
  });
  return findHourReturn;
}

export function daysWeek(week1: Array<any>, week2: Array<any>): boolean {
  let weekReturn;
  if (week2.length == 0) {
    return false;
  }

  weekReturn = week2.map((el, i) => {
    return el.day == week1[i].day
  })

  return weekReturn;
}

export function findWeek(el: any, value: string): boolean {

  el.forEach(element => {
    if (value == element.daysWeek.day) {
      return true;
    }
  })
  return false;
}