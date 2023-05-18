import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { BankData } from "../../types/bank-data-type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BankData[]>
) {
  try {
    const response = await axios.get(
      "https://random-data-api.com/api/v2/banks"
    );
    const data: BankData[] = response.data;

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500);
  }
}
