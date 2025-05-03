// src/utils/dateUtils.ts
export const getTodayDateString = (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };