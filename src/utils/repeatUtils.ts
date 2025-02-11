export function getRepeatEvents(schedule: { startDate: Date; endDate: Date; type: string }) {
  const { startDate, endDate, type } = schedule;
  const recurringDates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    recurringDates.push(new Date(currentDate));

    switch (type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      default:
        break;
    }
  }

  return recurringDates;
}

export function getNextMonthlyDate(baseDate: Date, targetDate: Date) {
  const nextDate = new Date(targetDate);
  console.log(nextDate);
  // 일자를 먼저 설정한 후 월을 변경
  nextDate.setMonth(baseDate.getMonth());
  // nextDate.setDate(baseDate.getDate()); // 자동 보정 방지

  // 날짜가 변경된 경우 (예: 2월 29일 → 3월 1일), 해당 월의 마지막 날로 조정
  if (nextDate.getMonth() !== baseDate.getMonth()) {
    console.log(nextDate.getMonth(), baseDate.getMonth());
    nextDate.setDate(0);
  }
  console.log(nextDate);

  return nextDate;
}

export function getNextYearlyDate(baseDate: Date, targetDate: Date) {
  const nextDate = new Date(targetDate);
  // nextDate.setFullYear(baseDate.getFullYear());
  // nextDate.setMonth(baseDate.getMonth());
  // nextDate.setDate(baseDate.getDate());

  if (nextDate.getFullYear() !== baseDate.getFullYear()) {
    nextDate.setFullYear(nextDate.getFullYear());
    nextDate.setMonth(nextDate.getMonth());
    nextDate.setDate(0);
  }
  console.log(nextDate);
  return nextDate;
}
