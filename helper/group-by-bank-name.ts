import _ from "lodash";
import { BankData } from "../types/bank-data-type";

export const groupByBankName = (banks: BankData[]) => {
  const groupedBanks = _.groupBy(banks, "bank_name");
  return Object.keys(groupedBanks).map((bankName) => {
    return {
      bankName,
      accounts: groupedBanks[bankName] as BankData[],
    };
  });
};
