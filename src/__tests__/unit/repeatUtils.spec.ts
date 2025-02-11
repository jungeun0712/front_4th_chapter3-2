import { describe, it, expect, beforeEach } from 'vitest';

import { Event } from '../../types';
import { getNextMonthlyDate, getNextYearlyDate, getRepeatEvents } from '../../utils/repeatUtils';

describe('getRepeatedEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2023-05-10',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2023-05-10',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'weekly', interval: 1 },
      notificationTime: 30,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2023-05-11',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'monthly', interval: 1 },
      notificationTime: 60,
    },
  ];

  it('매일 반복 일정이 정상적으로 생성되어야 한다', () => {
    const schedule = {
      startDate: new Date(), // setupTests에서 설정한 2024-10-01 사용
      endDate: new Date('2024-10-05'),
      type: 'daily',
    };

    const repeatDates = getRepeatEvents(schedule);
    expect(repeatDates).toHaveLength(5);
    repeatDates.forEach((date: Date, index: number) => {
      const expectedDate = new Date('2024-10-01');
      expectedDate.setDate(expectedDate.getDate() + index);
      expect(date.getTime()).toBe(expectedDate.getTime());
    });
  });

  it('매주 반복 일정이 정상적으로 생성되어야 한다', () => {
    const schedule = {
      startDate: new Date(),
      endDate: new Date('2024-10-22'),
      type: 'weekly',
    };

    const repeatDates = getRepeatEvents(schedule);
    expect(repeatDates).toHaveLength(4);
    repeatDates.forEach((date: Date, index: number) => {
      const expectedDate = new Date('2024-10-01');
      expectedDate.setDate(expectedDate.getDate() + index * 7);
      expect(date.getTime()).toBe(expectedDate.getTime());
    });
  });

  it('매월 반복 일정이 정상적으로 생성되어야 한다', () => {
    const schedule = {
      startDate: new Date(),
      endDate: new Date('2024-12-01'),
      type: 'monthly',
    };

    const repeatDates = getRepeatEvents(schedule);

    expect(repeatDates).toHaveLength(3);
    repeatDates.forEach((date: Date, index: number) => {
      const expectedDate = new Date('2024-10-01');
      expectedDate.setMonth(expectedDate.getMonth() + index);
      expect(date.getTime()).toBe(expectedDate.getTime());
    });
  });

  it('매년 반복 일정이 정상적으로 생성되어야 한다', () => {
    const schedule = {
      startDate: new Date(),
      endDate: new Date('2026-10-01'),
      type: 'yearly',
    };

    const repeatDates = getRepeatEvents(schedule);

    expect(repeatDates).toHaveLength(3);
    repeatDates.forEach((date: Date, index: number) => {
      const expectedDate = new Date('2024-10-01');
      expectedDate.setFullYear(expectedDate.getFullYear() + index);
      expect(date.getTime()).toBe(expectedDate.getTime());
    });
  });
});

describe('윤년 날짜 반복 테스트', () => {
  describe('윤년의 2월 29일 매월 반복 생성한다.', () => {
    const leapYearFeb29 = new Date('2024-02-29'); // 2024년은 윤년

    it('평년 2월에는 28일로 설정되어야 한다', () => {
      const nextYear = new Date('2025-02-28'); // 2025년 2월 (평년)
      const result = getNextMonthlyDate(leapYearFeb29, nextYear);
      console.log(result);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(28);
    });

    it('다른 달에는 29일로 설정되어야 한다', () => {
      const nextMonth = new Date('2024-03-29');
      const result = getNextMonthlyDate(leapYearFeb29, nextMonth);

      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(29);
    });
  });

  describe('윤년의 2월 29일 매년 반복 생성한다', () => {
    const leapYearFeb29 = new Date('2024-02-29'); // 2024년은 윤년

    it('평년에는 2월 28일로 설정되어야 한다', () => {
      const nextYear = new Date('2025-02-01');
      const result = getNextYearlyDate(leapYearFeb29, nextYear);

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(28);
    });

    it('다음 윤년에는 2월 29일로 설정되어야 한다', () => {
      const nextLeapYear = new Date('2028-02-01');
      const result = getNextYearlyDate(leapYearFeb29, nextLeapYear);

      expect(result.getFullYear()).toBe(2028);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(29);
    });
  });
});
