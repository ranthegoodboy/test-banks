import axios from "axios";
import { isEmpty } from "lodash";
import type { NextPage } from "next";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { groupByBankName } from "../helper/group-by-bank-name";
import { BankData } from "../types/bank-data-type";

const Home: NextPage = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Banks />
    </QueryClientProvider>
  );

  function Banks() {
    const [accountToView, setAccountToView] = useState({});
    const { isLoading, error, data, isFetching } = useQuery({
      queryKey: ["banks"],
      queryFn: () =>
        axios
          .get("https://random-data-api.com/api/v2/banks?size=20")
          .then((res) => res.data),
    });

    if (isFetching || isLoading) return <div>Fetching banks...</div>;
    if (error)
      return <div>Something went wrong. Please reload your browser.</div>;

    const groupedByBankName = groupByBankName(data);

    return (
      <div className="p-[5rem] ">
        <div className="flex justify-center font-bold text-3xl mb-10">
          GROUP ACCOUNTS BY BANK NAME WITH VIEW INFO
        </div>
        <div className="relative">
          {groupedByBankName.map((bank, index) => (
            <div key={index} className="mb-10">
              <div className="bg-blue-200 pl-2 py-1">{bank.bankName}</div>
              <div>
                {bank.accounts.map((account, index) => (
                  <div
                    key={account.id}
                    className={`flex gap-5 pl-2 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                    }`}
                  >
                    <div>
                      Account #:{" "}
                      <span className="font-bold">
                        {account.account_number}
                      </span>
                    </div>
                    <div
                      className="text-blue-600 underline cursor-pointer"
                      onClick={() => {
                        setAccountToView(account);
                      }}
                    >
                      View Info
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <AccountInfo
            account={accountToView}
            setAccountToView={setAccountToView}
          ></AccountInfo>
        </div>
      </div>
    );
  }

  function AccountInfo({
    account,
    setAccountToView,
  }: {
    account: BankData;
    setAccountToView: React.Dispatch<React.SetStateAction<BankData>>;
  }) {
    return (
      <div
        className={`absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]  bg-green-300 m-[auto] p-5 ${
          !isEmpty(account) ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-center mb-5 font-bold text-xxl">
          ACCOUNT INFO
        </div>
        <div>
          <span className="font-bold">Account #:</span> {account.account_number}
        </div>
        <div>
          <span className="font-bold">Bank Name:</span> {account.bank_name}
        </div>
        <div>
          <span className="font-bold">IBAN:</span> {account.iban}
        </div>
        <div>
          <span className="font-bold">ID:</span> {account.id}
        </div>
        <div>
          <span className="font-bold">Routing #:</span> {account.routing_number}
        </div>
        <div>
          <span className="font-bold">Swift BIC #:</span> {account.swift_bic}
        </div>
        <div>
          <span className="font-bold">UID #:</span> {account.uid}
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setAccountToView({})}
            className="bg-green-800 text-white py-1 px-4"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
};

export default Home;
