export const formatCurrency = (number = 0) => {
  if (number < 1000) {
    return number.toString();
  }
  const usFormatter = new Intl.NumberFormat('en-US');
  return usFormatter.format(number);
};

export const rounderNumber = (val: number) =>
  val.toLocaleString('en', { maximumFractionDigits: 3 });

export const roundNumber = (digits = 0) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(digits);
};

export const formatCurrencyV2 = (value: number) => {
  const formattedValue = !value
    ? ''
    : value < 1_000
    ? `${value}`
    : value >= 1_000 && value < 1_000_000
    ? `${value / 1_000}k`
    : `${(value / 1_000_000).toFixed(1)}m`;
  return formattedValue;
};
