export type FormValue = {
  // fToken: string;
  // fAddress: string;
  // fAmount: number;
  // tToken: string;
  // tAddress: string;
  // tAmount: number;
  slippage: number;
  f: {
    token: { symbol: string; price: number; address: string };
    amount: number;
  };
  t: {
    token: { symbol: string; price: number; address: string };
    amount: number;
  };
};

export type Asset = {
  currency: string;
  date: string;
  //   price: string;
  price: number;
  isFavorite?: boolean;
};

export type TransactionType = 'send' | 'receive';
