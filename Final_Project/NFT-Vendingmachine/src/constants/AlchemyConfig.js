import { Alchemy, Network } from "alchemy-sdk";
const config = {
  apiKey: "IR2fDkVQLPneXqbzF5hIQwQg2Bz994tR",
  network: Network.ETH_SEPOLIA,
};
export const alchemy = new Alchemy(config);
