import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

/**
 * Chuyển ngày từ UTC sang local và format DD/MM/YYYY
 * @param {string|Date} date - ngày UTC từ API
 * @returns {string} ngày theo định dạng DD/MM/YYYY
 */
export const formatDate = (date) => {
  if (!date) return "";
  return dayjs.utc(date).local().format("DD/MM/YYYY");
};
