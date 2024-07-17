import { useMemo } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  //  getPriority might refactor as bellow, and should use useCallback for enhance performance, until React 19 release
  const getPriority = (blockchain: any): number => {
    const priority =
      {
        Osmosis: 100,
        Ethereum: 50,
        Arbitrum: 30,
        Zilliqa: 20,
        Neo: 20,
      }[blockchain] ?? -99;

    return priority;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
          //  In this if condition it should return boolean
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        } else {
          // it should return a number to make sort function worked as expected
        }
      });
  }, [balances, getPriority, prices]); //  No need `prices` here, remove if from dependencies

  // Remove this function
  //   const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  //     return {
  //       ...balance,
  //       formatted: balance.amount.toFixed(),
  //     };
  //   });

  //   Use `useMemo` for caching
  const rows = useMemo(
    () =>
      sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      }),
    [sortedBalances, prices, classes]
  );

  return <div {...rest}>{rows}</div>;
};
