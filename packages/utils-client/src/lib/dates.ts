import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export const formattedDate = (date: Date, format = "LL") => {
  return dayjs(date).format(format);
};

export const relativeDate = (date: Date) => {
  return dayjs().to(dayjs(date));
};
