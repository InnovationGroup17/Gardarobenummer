import moment from "moment/moment";

export const timestamp = () => {
  return moment().format("DD-MM-YYYY HH:mm");
};
