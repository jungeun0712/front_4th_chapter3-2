export function getRepeatEvents(schedule: {
  startDate: Date;
  endDateOfString: string;
  repeatType: string;
  repeatInterval: number;
}) {
  const { startDate, endDateOfString, repeatType, repeatInterval } = schedule;

  const endDate = new Date(endDateOfString);
  if (repeatInterval < 1) {
    throw new Error('반복 간격은 1 이상이어야 합니다.');
  }

  const repeatDates = [];
  let currentDate = new Date(startDate);

  const getLastDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  while (currentDate <= endDate) {
    repeatDates.push(new Date(currentDate));

    switch (repeatType) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + repeatInterval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7 * repeatInterval);
        break;
      case 'monthly':
        // 현재 월에 repeatInterval 곱한 만큼 더함
        let targetMonth = currentDate.getMonth() + repeatInterval;
        const targetYear = currentDate.getFullYear() + Math.floor(targetMonth / 12);
        targetMonth = targetMonth % 12;

        currentDate.setFullYear(targetYear);
        currentDate.setMonth(targetMonth);

        // 월말 날짜 처리
        const lastDayOfMonth = getLastDayOfMonth(currentDate);
        if (currentDate.getDate() > lastDayOfMonth) {
          currentDate.setDate(lastDayOfMonth);
        } else {
          currentDate.setDate(currentDate.getDate());
        }
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + repeatInterval);
        if (currentDate.getMonth() === 1 && currentDate.getDate() === 29) {
          const isLeapYear = (year: number) =>
            (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
          if (!isLeapYear(currentDate.getFullYear())) {
            currentDate.setDate(28);
          }
        }
        break;
      default:
        break;
    }
  }

  return repeatDates;
}

export function getNextRepeatDate(baseDate: Date, targetDate: Date) {
  // 현재 날짜의 일자를 가져옴
  const currentDay = baseDate.getDate();

  // 목표 연도와 월을 가져옴
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();

  // 목표 연월의 마지막 날짜를 계산
  const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

  // 현재 일자가 목표 월의 마지막 날짜보다 크면 마지막 날짜를 사용
  const adjustedDay = Math.min(currentDay, lastDayOfMonth);

  // 새로운 날짜 객체 생성 및 반환
  return new Date(targetYear, targetMonth, adjustedDay);
}
