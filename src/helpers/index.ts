import uniqolor from 'uniqolor';
import dayjs from 'dayjs';
import { LANDSCAPE_HEIGHT } from '../constants';

export const cleanObj = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (
      newObj[key] === null ||
      newObj[key] === '' ||
      newObj[key] === undefined
    ) {
      delete newObj[key];
    }
  });

  return newObj;
};

export const isTelePlatform = () => !!window.Telegram?.WebApp?.initData;

export const trimAllValues = (obj: any, isRemoveEmpty = false) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(k => {
    if (typeof newObj[k] === 'string') {
      newObj[k] =
        isRemoveEmpty && newObj[k].trim() === '' ? null : newObj[k].trim();
    } else if (Array.isArray(newObj[k])) {
      newObj[k] = newObj[k].map((item: any) => {
        if (typeof item === 'string') {
          return isRemoveEmpty && item.trim() === '' ? null : item.trim();
        } else if (typeof item === 'object') {
          return trimAllValues(item, isRemoveEmpty);
        }
        return item;
      });
    } else if (typeof newObj[k] === 'object' && newObj[k] !== null) {
      newObj[k] = trimAllValues(newObj[k], isRemoveEmpty);
    }
  });
  return newObj;
};

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
export const getMobileOperatingSystem = ():
  | 'iOS'
  | 'Android'
  | 'Windows Phone'
  | 'unknown'
  | undefined => {
  if (typeof window !== 'undefined') {
    const userAgent =
      window.navigator.userAgent || window.navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window?.MSStream) {
      return 'iOS';
    }
    return 'unknown';
  }
  return undefined;
};

export const isMobile = () => {
  if (typeof window !== 'undefined') {
    // Client-side-only code
    return window.navigator?.userAgentData?.mobile;
  }
  return false;
};

export const isLandscape = () => {
  if (typeof window !== 'undefined') {
    return window.innerHeight < LANDSCAPE_HEIGHT;
  }
  return false;
};

export const isDev = process.env.GRAPHQL_URL?.includes('dev-');
export const enableTonWallet = process.env.WALLET_FEATURE_ENABLED === 'true';

export const getColor = () =>
  uniqolor.random({
    lightness: 80,
  }).color;

export const formatAddress = (str = '', lastLength = 4) => {
  if (!str) return '';
  const firstPart = str?.slice(0, 8);
  const lastPart = str?.slice(-lastLength);
  return `${firstPart}...${lastPart}`;
};

export const getRemainingTime = () => {
  const diffTime = dayjs('06/20/2024').diff(dayjs());
  const diffTimeDayjs = dayjs(diffTime);
  return {
    diffTime,
    days: dayjs('06/20/2024').diff(dayjs(), 'day'),
    hours: diffTimeDayjs.get('hours'),
    mins: diffTimeDayjs.get('minutes'),
    seconds: diffTimeDayjs.get('seconds'),
  };
};
