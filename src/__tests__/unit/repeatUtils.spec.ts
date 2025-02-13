import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import App from '../../App';
import { getNextRepeatDate, getRepeatEvents } from '../../utils/repeatUtils';

describe('반복 일정 삭제', () => {
  it('반복 일정을 삭제하면 해당 일정만 삭제된다', () => {});
});

describe('반복 유형 선택 테스트', () => {
  it('매일 반복 일정이 정상적으로 생성되어야 한다', () => {
    const schedule = {
      startDate: new Date(), // setupTests에서 설정한 2024-10-01 사용
      endDateOfString: '2024-10-05',
      repeatType: 'daily',
      repeatInterval: 1,
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
      endDateOfString: '2024-10-22',
      repeatType: 'weekly',
      repeatInterval: 1,
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
      endDateOfString: '2024-12-14',
      repeatType: 'monthly',
      repeatInterval: 1,
    };

    const repeatDates = getRepeatEvents(schedule);

    expect(repeatDates).toHaveLength(3);

    const expectedDates = [new Date('2024-10-01'), new Date('2024-11-01'), new Date('2024-12-01')];

    repeatDates.forEach((date: Date, index: number) => {
      expect(date.getTime()).toBe(expectedDates[index].getTime());
    });
  });

  it('매년 반복 일정이 정상적으로 생성되어야 한다', () => {
    const schedule = {
      startDate: new Date(),
      endDateOfString: '2026-10-01',
      repeatType: 'yearly',
      repeatInterval: 1,
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

// 윤년/31월일 경우 반복 설정
describe('윤년/31월일 경우 반복 ', () => {
  describe('윤년의 2월 29일 매월 반복 생성한다.', () => {
    const leapYearFeb29 = new Date('2024-02-29'); // 2024년은 윤년

    it('평년 2월에는 28일로 설정되어야 한다', () => {
      const newDate = new Date('2025-02-28'); // 2025년 2월 (평년)
      const result = getNextRepeatDate(leapYearFeb29, newDate);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(28);
    });

    it('다른 달에는 29일로 설정되어야 한다', () => {
      const newDate = new Date('2024-03-29');
      const result = getNextRepeatDate(leapYearFeb29, newDate);

      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(29);
    });
  });

  describe('반복 일정이 31일일 경우 해당 달의 마지막 날짜로 설정한다.', () => {
    const leapYearFeb29 = new Date('2024-03-31'); // 2024년은 윤년

    it('4,6,9,11에는 30일로 설정되어야 한다', () => {
      const newDate = new Date('2024-04-30');
      const result = getNextRepeatDate(leapYearFeb29, newDate);

      expect(result.getMonth()).toBe(3);
      expect(result.getDate()).toBe(30);
    });
  });
});

// 반복 간격
describe('반복 간격 테스트', () => {
  it('2일마다 반복되는 일정을 생성해야 한다', () => {
    const schedule = {
      startDate: new Date(),
      endDateOfString: '2024-10-05',
      repeatType: 'daily',
      repeatInterval: 2,
    };

    const dates = getRepeatEvents(schedule);

    expect(dates).toHaveLength(3);
    expect(dates[0].toISOString()).toBe(new Date('2024-10-01').toISOString());
    expect(dates[1].toISOString()).toBe(new Date('2024-10-03').toISOString());
    expect(dates[2].toISOString()).toBe(new Date('2024-10-05').toISOString());
  });

  it('반복 간격이 1보다 작으면 에러를 발생시킨다', () => {
    const schedule = {
      startDate: new Date(),
      endDateOfString: '2024-10-05',
      repeatType: 'daily',
      repeatInterval: 0,
    };

    expect(() => getRepeatEvents(schedule)).toThrow('반복 간격은 1 이상이어야 합니다.');
  });
});

// 반복 종료
describe('종료 조건 테스트', () => {
  it('특정 날짜까지 반복되는 일정을 생성할 수 있다', () => {});

  it('종료 날짜가 시작 날짜보다 이전이면 에러를 발생시킨다', () => {});
});

// 반복 일정 단일 수정
describe('반복 일정 단일 수정 테스트', () => {
  it('반복 일정을 수정하면 단일 일정으로 변경된다', () => {});

  it('반복 일정이 단일 일정으로 변경되면 아이콘이 사라진다', () => {});
});

// 반복 일정 삭제
describe('반복 일정 삭제', () => {
  it('반복 일정을 삭제하면 해당 일정만 삭제된다', () => {});
});
