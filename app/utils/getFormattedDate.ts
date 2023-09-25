import {
  differenceInHours,
  differenceInMinutes,
  format,
  isSameYear,
  isToday,
} from "date-fns";

const getFormattedDate = (createdAt: number, now: Date | null) => {
  if (!now) return;
  const date = new Date(createdAt);
  const isThisYear = isSameYear(now, date);

  if (isThisYear) {
    if (isToday(date)) {
      const hoursDifference = differenceInHours(now, date);
      if (hoursDifference <= 0) {
        const minutesDifference =
          differenceInMinutes(now, date) === 0
            ? `방금 전`
            : `${differenceInMinutes(now, date)}분 전`;
        return minutesDifference;
      } else {
        return `${hoursDifference}시간 전`;
      }
    } else {
      const createdDate = format(date, "M월 d일");
      return createdDate;
    }
  } else {
    const createdDate = format(date, "yyyy년 M월 d일");
    return createdDate;
  }
};

export default getFormattedDate;
