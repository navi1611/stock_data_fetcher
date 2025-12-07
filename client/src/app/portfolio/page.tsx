'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import TableComponent from "@/components/TableComponent";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchHoldingsBySector } from '@/store/thunks/stockThunks';
import { formatTime } from '@/helper';
import { DownIcon, UpIcon } from '../../../public';
import { useRouter } from 'next/navigation';


export default function Portfolio() {
  const dispatch = useAppDispatch();
  const { holdingsBySector } = useAppSelector((state) => state.stock);
  const [lastFetchedTime, setLastFetchedTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    }
    try {
      await dispatch(fetchHoldingsBySector()).unwrap();
      setLastFetchedTime(new Date());
    } catch (error) {
      setError("Error fetching portfolio data" as string);
      console.error('Error fetching portfolio data:', error);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData(true);

    intervalRef.current = setInterval(() => {
      fetchData(false);
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);



  const getTableData = (holdings: any[]) => {
    return holdings.map((holding) => ({
      particulars: holding.particulars,
      purchasePrice: holding.purchasePrice,
      quantity: holding.quantity,
      investment: holding.investment,
      portfolioPercent: holding.portfolioPercent,
      exchange: holding.exchange,
      cmp: holding.cmp,
      presentValue: holding.presentValue,
      gainLoss: {
        value: holding.gainLoss,
        arrow: holding.gainLoss > 0 ? <UpIcon /> : <DownIcon />,
      },
      peRatio: holding.peRatio,
    }));
  };

  const columns = [
    {
      Header: 'Stock Name',
      accessor: 'particulars',
      Cell: ({ value }: { value: string }) => <span className="font-medium">{value}</span>
    },
    {
      Header: 'Purchase Price',
      accessor: 'purchasePrice',
      Cell: ({ value }: { value: number }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Qty',
      accessor: 'quantity'
    },
    {
      Header: 'Investment',
      accessor: 'investment',
      Cell: ({ value }: { value: number }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Portfolio',
      accessor: 'portfolioPercent',
      Cell: ({ value }: { value: number }) => `${value.toFixed(2)}%`
    },
    {
      Header: 'Exchange',
      accessor: 'exchange'
    },
    {
      Header: 'CMP',
      accessor: 'cmp',
      Cell: ({ value }: { value: number }) => value > 0 ? `$${value.toFixed(2)}` : 'N/A'
    },
    {
      Header: 'Present Value',
      accessor: 'presentValue',
      Cell: ({ value }: { value: number }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Gain/Loss',
      accessor: 'gainLoss',
      Cell: ({ value }: { value: number, arrow: React.ReactNode }) => {
        return (
          <span className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
            {value.arrow} {value.value.toFixed(2)}
            {/* {value >= 0 ? '+' : ''}${value.toFixed(2)} */}
          </span>
        );
      }
    },
    {
      Header: 'P/E Ratio',
      accessor: 'peRatio',
      Cell: ({ value }: { value: number | null }) => value ? value.toFixed(2) : 'N/A'
    },
  ];

  return (
    <div className="flex h-screen ">
      <main className="flex-1 flex flex-col overflow-auto">
        <header className="w-full shadow-sm p-2 flex justify-between items-center bg-gradient-to-l from-black via-black to-[#8fd84c]">
          <h1 className="text-xl font-semibold text-[#121215]">Portfolio</h1>
          <button onClick={() => router.push('/')} className='bg-[#8fd84c] p-2 border border-[#8fd84c] rounded-2xl font-semibold text-[#121215] cursor-pointer hover:scale-105 transition-all duration-300 fade-in' >Dashboard</button>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {lastFetchedTime && (
            <div className="relative w-full bg-[#121215] rounded-xl shadow-md p-4 fade-in
                ring-1 ring-[#8EE000]/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#9AA0B5]">Last updated:</span>
                <span className="text-sm font-semibold text-[#8fd84c]">
                  {formatTime(lastFetchedTime)}
                </span>
              </div>
            </div>
          )}
          {loading ? (
            <>
              <div className="w-full  bg-[#121215]  rounded-xl shadow-md p-6">
                <div className="space-y-2 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`grid grid-cols-11 gap-4 p-4  odd:bg-[#222229] even:bg-[#2B2B33]`}>
                      {[...Array(11)].map((_, j) => (
                        <div key={j} className="h-4 bg-[#3A3A45] rounded"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full  bg-[#121215]  rounded-xl shadow-md p-6">
                <div className="space-y-2 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`grid grid-cols-11 gap-4 p-4 odd:bg-[#222229] even:bg-[#2B2B33]`}>
                      {[...Array(11)].map((_, j) => (
                        <div key={j} className="h-4 bg-[#3A3A45] rounded"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full  bg-[#121215]  rounded-xl shadow-md p-6">
                <div className="space-y-2 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`grid grid-cols-11 gap-4 p-4 odd:bg-[#222229] even:bg-[#2B2B33]`}>
                      {[...Array(11)].map((_, j) => (
                        <div key={j} className="h-4 bg-[#3A3A45] rounded"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : holdingsBySector.length > 0 ? (
            holdingsBySector.map((sectorData, index) => (
              <div key={index} className="w-full  bg-[#121215] rounded-xl shadow-md p-6 overflow-auto">
                <h2 className="relative text-lg font-semibold text-[#9AA0B5] mb-4 pb-2 ">
                  {sectorData.sector}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-l from-black to-[#8EE000]"></div>
                </h2>
                {sectorData.holdings && sectorData.holdings.length > 0 ? (
                  <TableComponent
                    data={getTableData(sectorData.holdings)}
                    columns={columns}
                    pageSize={10}
                    showPagination={true}
                    showSorting={true}
                  />
                ) : (
                  <div className="text-gray-500 text-center py-8">No holdings available for this sector</div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full    rounded-xl shadow-md p-6">
              <div className="text-gray-500 text-center py-8">No portfolio data available</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
