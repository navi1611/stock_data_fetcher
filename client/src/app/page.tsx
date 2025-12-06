'use client';

import { useEffect, useMemo } from 'react';
import TableComponent from "@/components/TableComponent";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStockData, fetchTrendingStocks, fetchUsStocks } from '@/store/thunks/stockThunks';

const columns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Price', accessor: 'price' },
  { Header: 'Symbol', accessor: 'symbol' },
  { Header: 'Change', accessor: 'change' },
  { Header: 'Change %', accessor: 'changePercent' },
];

export default function Home() {
  const dispatch = useAppDispatch();
  const { stocks, usStocks, loading, error } = useAppSelector((state) => state.stock);
  console.log("🚀 ~ Home ~ stocks:", stocks)

  useEffect(() => {
    // Fetch US stocks on component mount
    // Pass as array of individual symbols
    // dispatch(fetchStockData(["MSFT", "GOOG", "GOOGL", "NVDA", "ORCL", "CSCO", "AMD"]));
    dispatch(fetchUsStocks());
  }, [dispatch]);

  // Transform stock data for the table
  const tableData = useMemo(() => {
    if (stocks.length > 0) {
      return stocks.map((stock) => ({
        name: stock.longName || stock.shortName || stock.symbol,
        price: stock.regularMarketPrice?.toFixed(2) || 'N/A',
        symbol: stock.symbol,
        change: stock.regularMarketChange?.toFixed(2) || 'N/A',
        changePercent: stock.regularMarketChangePercent
          ? `${stock.regularMarketChangePercent.toFixed(2)}%`
          : 'N/A',
      }));
    }

    // If no stocks, flatten US stocks data
    if (usStocks.length > 0) {
      return usStocks.flatMap((sectorData) =>
        sectorData.data.map((stock) => ({
          name: stock.longName || stock.shortName || stock.symbol,
          price: stock.regularMarketPrice?.toFixed(2) || 'N/A',
          symbol: stock.symbol,
          change: stock.regularMarketChange?.toFixed(2) || 'N/A',
          changePercent: stock.regularMarketChangePercent
            ? `${stock.regularMarketChangePercent.toFixed(2)}%`
            : 'N/A',
        }))
      );
    }

    return [];
  }, [stocks, usStocks]);

  return (
    <div className=" h-screen w-full flex flex-col items-center justify-center">
      <div className="p-10 h-[50px]">
        <p>Stock Data</p>
      </div>
      {error && (
        <div className="p-4 bg-red-500 text-white rounded mb-4">
          Error: {error}
        </div>
      )}
      <div className=" h-[calc(100vh - 50px)] w-full max-w-7xl overflow-auto ">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading stock data...</p>
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
  );
}
