import WebSocket from "ws";
import {
  getFuturesPairs,
  fetchHistoricalVolume,
} from "./utils/binance/endpoints";
import { findMax } from "./utils/commons/arrayfunctions";
import { getTimenow } from "./utils/time";

const shiftElements = (array: number[], element: number) => {
  let new_array = array.map((_) => _);
  for (let i = 0; i < array.length - 1; i++) {
    new_array[i] = new_array[i + 1];
  }
  new_array[array.length - 1] = element;
  return new_array;
};

const klineSocketFuturesAndVolumeCompare = (
  pair: string,
  interval: string,
  volme_multiplier: number,
  historical_volumes: number[]
) => {
  var ws = new WebSocket(
    `wss://fstream.binance.com/ws/${pair}@kline_${interval}`
  );
  ws.on("open", () => {});

  ws.on("message", async (data, isBinary) => {
    const message = isBinary ? data : data.toString();
    const { k: parsed_message } = await JSON.parse(message as string);
    if (!parsed_message.x) return;
    const current_volume = parsed_message.q;
    if (
      Number(current_volume) >
      findMax(historical_volumes) * volme_multiplier
    ) {
      console.log(
        getTimenow(),
        " : ",
        pair,
        interval,
        "Futures",
        "Increased by :",
        Number(current_volume) / findMax(historical_volumes),
        "x"
      );
    }
    historical_volumes = shiftElements(
      historical_volumes,
      Number(current_volume)
    );
  });
};

const PAST_CANDLES_TO_CONSIDER_VOLUME = 100;
const VOLUME_MULTIPLIER = 2;
const TIME_FRAME = "1m";

async function main() {
  const futures_apirs = await getFuturesPairs();
  console.log(futures_apirs.length);
  let index = -1;
  var refreshIntervalId = setInterval(async () => {
    let historical_volumes;
    if (index >= futures_apirs.length) return clearInterval(refreshIntervalId);
    index++;
    try {
      historical_volumes = await fetchHistoricalVolume(
        futures_apirs[index].toUpperCase(),
        TIME_FRAME,
        PAST_CANDLES_TO_CONSIDER_VOLUME
      );
    } catch (e) {
      console.log("error with", futures_apirs[index]);
      return;
    }
    klineSocketFuturesAndVolumeCompare(
      futures_apirs[index],
      TIME_FRAME,
      VOLUME_MULTIPLIER,
      historical_volumes
    );
  }, 3000);
}

main();
