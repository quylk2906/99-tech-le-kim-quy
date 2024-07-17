// I guest that is too simple to explain how it work

const sum_to_n_a = function (n: number) {
  // using math logic
  return (n * (n + 1)) / 2;
};

const sum_to_n_b = function (n: number) {
  // using for loop
  let sum = 0;
  for (let i = n; i >= 0; i--) {
    sum += i;
  }
  return sum;
};

const sum_to_n_c = function (n: number) {
  // using recursive
  if (n === 0) {
    return 0;
  }
  return n + sum_to_n_c(n - 1);
};

const sum_to_n_d = function (n: number) {
  // using while loop
  let rs = 0;
  while (n > 0) {
    rs += n;
    n--;
  }
  return rs;
};
