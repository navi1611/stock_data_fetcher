'use client';

import { useEffect, useMemo } from 'react';
import TableComponent from "@/components/TableComponent";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsStocks } from '@/store/thunks/stockThunks';
import { DownIcon, UpIcon } from '../../public';

const columns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Symbol', accessor: 'symbol' },
  { Header: 'Price', accessor: 'price' },
  {
    Header: 'Change',
    accessor: 'change',
    Cell: ({ value }) => (
      <span className={`${value.color} font-medium flex items-center gap-1`}>
        {value.arrow} {value.value}
      </span>
    ),
  },
  {
    Header: 'Change %',
    accessor: 'changePercent',
    Cell: ({ value }) => (
      <span className={`${value.color} font-medium flex items-center gap-1`}>
        {value.arrow} {value.value}
      </span>
    ),
  },
];

export default function Home() {
  const dispatch = useAppDispatch();
  const { usStocks, loading } = useAppSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchUsStocks());
  }, [dispatch]);

  const tableData = useMemo(() => {
    if (usStocks.length > 0) {
      return usStocks.flatMap((sectorData) =>
        sectorData.data.map((stock) => {
          const change = stock.regularMarketChange;
          const changePercent = stock.regularMarketChangePercent;
          const isUp = change > 0;
          const isDown = change < 0;

          return {
            name: stock.longName || stock.shortName || stock.symbol,
            price: stock.regularMarketPrice?.toFixed(2) || "N/A",
            symbol: stock.symbol,
            change: {
              value: change?.toFixed(2) || "N/A",
              arrow: isUp ? <UpIcon/> : isDown ? <DownIcon/>: "–",
              color: isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-500",
            },
            changePercent: {
              value: changePercent ? `${changePercent.toFixed(2)}%` : "N/A",
              arrow: isUp ? <UpIcon/> : isDown ? <DownIcon/>: "–",
              color: isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-500",
            },
          };
        })
      );
    }
    return [];
  }, [usStocks]);

  return (
    <div className="flex h-screen bg-gray-100">

      <main className="flex-1 flex flex-col overflow-auto">
        <header className="w-full bg-white shadow-sm p-5 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="w-full bg-white rounded-xl shadow-md p-6 overflow-auto">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`grid grid-cols-5 gap-4 p-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}>
                    <div className="h-4 bg-gray-300 rounded col-span-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <TableComponent
                data={tableData}
                columns={columns}
                pageSize={10}
                showPagination={true}
                showSorting={true}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
