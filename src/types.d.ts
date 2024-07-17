export type FormValue = {
  // fToken: string;
  // fAddress: string;
  // fAmount: number;
  // tToken: string;
  // tAddress: string;
  // tAmount: number;
  slippage: number;
  f: {
    token: Asset;
    amount: number;
  };
  t: {
    token: Asset;
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
