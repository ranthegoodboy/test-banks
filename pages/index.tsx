import axios from "axios";
import _, { isEmpty } from "lodash";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
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
    const [numItems, setNumItems] = useState<number>(10);
    const [isValidItemNum, setIsValidItemNum] = useState<boolean>(
      isValidItemNumChk(numItems)
    );
    const { isLoading, error, data, isFetching, refetch } = useQuery({
      queryKey: ["banks"],
      queryFn: () =>
        axios
          .get(`https://random-data-api.com/api/v2/banks?size=${numItems}`)
          .then((res) => res.data),
      refetchOnWindowFocus: false,
    });

    useEffect(() => {
      refetch();
    }, [numItems, refetch]);

    if (isFetching || isLoading) return <div>Fetching Bank Accounts...</div>;
    if (error)
      return <div>Something went wrong. Please reload your browser.</div>;

    function isValidItemNumChk(val: number) {
      if (isNaN(val) || val < 2 || val > 100) return false;
      return true;
    }
    const onNumItemsChange = _.debounce(function (val) {
      if (!isValidItemNumChk(val)) {
        setIsValidItemNum(false);
        return;
      }
      setIsValidItemNum(true);
      setNumItems(val);
    }, 1000);

    const groupedByBankName = groupByBankName(data);

    return (
      <div className="p-[5rem]">
        <div className="flex flex-col gap-2 items-center justify-center font-bold text-3xl mb-10">
          GROUP ACCOUNTS BY BANK NAME WITH VIEW INFO
          <div className="text-base flex gap-2">
            Input number of items to fetch (min: 2, max: 100):
            <input
              type="number"
              className={`border border-gray-600 w-[70px] pl-1 text-center ${
                isValidItemNum ? "text-black" : "text-red-500"
              }`}
              defaultValue={numItems.toString()}
              onChange={(e) =>
                onNumItemsChange(parseInt(e.currentTarget.value))
              }
            />
          </div>
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
                      onClick={() => setAccountToView(account)}
                    >
                      View Info
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!isEmpty(accountToView) && (
            <AccountInfo
              account={accountToView}
              setAccountToView={setAccountToView}
            />
          )}
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
      <div className="fixed top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-green-300 m-[auto] p-5">
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
