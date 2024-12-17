import axios from "axios";

export const getFuturesPairs = async () => {
  const {
    data: { symbols },
  } = await axios.get("https://www.binance.com/fapi/v1/exchangeInfo");
  return symbols.map(({ pair }: { pair: string }) => pair.toLowerCase());
};

export const fetchHistoricalVolume = async (
  pair: string,
  interval: string,
  limit: number
) => {
  const new_limit = limit + 2;
  const response = await axios.get(
    `https://binance.com/fapi/v1/klines?symbol=${pair}&contractType=PERPETUAL&interval=${interval}&limit=${new_limit}`
  );
  return response.data
    .map((element: any, index: number) => Number(element[7]))
    .slice(0, -1)
    .slice(0, -1); //removing last 2 candles as they might be latest one, appliable for 1m timeframe only
};

