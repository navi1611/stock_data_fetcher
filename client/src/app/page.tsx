'use client';

import React, { useEffect, useMemo } from 'react';
import TableComponent from "@/components/TableComponent";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsStocks } from '@/store/thunks/stockThunks';
import { DownIcon, UpIcon } from '../../public';
import { useRouter } from 'next/navigation';

interface ChangeValue {
  value: string;
  arrow: React.ReactNode;
  color: string;
}

interface TableRow {
  name: string;
  symbol: string;
  price: string;
  change: ChangeValue;
  changePercent: ChangeValue;
}

const columns = [
  { Header: 'Name', accessor: 'name' as const },
  { Header: 'Symbol', accessor: 'symbol' as const },
  { Header: 'Price', accessor: 'price' as const },
  {
    Header: 'Change',
    accessor: 'change' as const,
    Cell: ({ value }: { value: ChangeValue }) => (
      <span className={`${value.color} font-medium flex items-center gap-1`}>
        {value.arrow} {value.value}
      </span>
    ),
  },
  {
    Header: 'Change %',
    accessor: 'changePercent' as const,
    Cell: ({ value }: { value: ChangeValue }) => (
      <span className={`${value.color} font-medium flex items-center gap-1`}>
        {value.arrow} {value.value}
      </span>
    ),
  },
];

export default function Home() {
  const dispatch = useAppDispatch();
  const { usStocks, loading } = useAppSelector((state) => state.stock);

  const router = useRouter()

  useEffect(() => {
    dispatch(fetchUsStocks());
  }, [dispatch]);

  const tableData = useMemo(() => {
    if (usStocks.length > 0) {
      return usStocks.flatMap((sectorData) =>
        sectorData.data.map((stock) => {
          const change = stock.regularMarketChange ?? 0;
          const changePercent = stock.regularMarketChangePercent ?? 0;
          const isUp = change > 0;
          const isDown = change < 0;

          return {
            name: stock.longName || stock.shortName || stock.symbol,
            price: stock.regularMarketPrice?.toFixed(2) || "N/A",
            symbol: stock.symbol,
            change: {
              value: change?.toFixed(2) || "N/A",
              arrow: isUp ? <UpIcon /> : isDown ? <DownIcon /> : "–",
              color: isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-500",
            },
            changePercent: {
              value: changePercent ? `${changePercent.toFixed(2)}%` : "N/A",
              arrow: isUp ? <UpIcon /> : isDown ? <DownIcon /> : "–",
              color: isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-500",
            },
          };
        })
      );
    }
    return [];
  }, [usStocks]);

  return (
    <div className="flex h-screen ">
      <main className="flex-1 flex flex-col overflow-auto">
        <header className="w-full shadow-sm p-2 flex justify-between items-center bg-gradient-to-l from-black via-black to-[#8fd84c]">
          <h1 className="text-xl font-semibold text-[#121215]">Dashboard</h1>
          <button onClick={() => router.push('/portfolio')} className='text-sm bg-[#8fd84c] py-1 px-2 border border-[#8fd84c] rounded-2xl font-semibold text-[#121215] cursor-pointer hover:scale-105 transition-all duration-300 fade-in' >Portfolio</button>
        </header>

        <div className="flex-1 p-6 ">
          <div className="w-full rounded-xl  p-6 overflow-auto bg-[#121215]">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`grid grid-cols-5 gap-4 p-4 odd:bg-[#222229] even:bg-[#2B2B33]`}>
                    <div className="h-4 bg-[#3A3A45] rounded col-span-2"></div>
                    <div className="h-4 bg-[#3A3A45] rounded"></div>
                    <div className="h-4 bg-[#3A3A45] rounded"></div>
                    <div className="h-4 bg-[#3A3A45] rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              tableData.length > 0 ?
                <TableComponent
                  data={tableData}
                  columns={columns}
                  pageSize={10}
                  showPagination={true}
                  showSorting={true}
                /> :
                <div className="w-full rounded-xl shadow-md p-6">
                  <div className="text-gray-500 text-center py-8">No  data available</div>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
