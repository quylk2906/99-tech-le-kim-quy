import { TOKENS } from '../resources/token';
import { Asset } from '../types';

export const getTokens = async (): Promise<Asset[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(TOKENS);
    }, 1000);
  });
