import { css } from '@emotion/css';
import { Typography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import clsx from 'clsx';
import { useMemo } from 'react';
import styles from './AppText.module.scss';
const { Text } = Typography;

type Props = TextProps & {
  color?: 'black' | 'primary' | 'green' | 'link' | 'red' | 'grey' | 'white';
  fontSize?: number;
  fontWeight?: 300 | 400 | 500 | 600 | 700 | 800;
  capitalized?: boolean;
  underline?: boolean;
  center?: boolean;
};

const textColor = {
  black: styles['appText--black'],
  primary: styles['appText--primary'],
  green: styles['appText--green'],
  link: styles['appText--link'],
  red: styles['appText--red'],
  white: styles['appText--white'],
  grey: styles['appText--grey'],
};

const AppText = ({
  color,
  fontSize,
  fontWeight,
  capitalized,
  underline,
  center,
  ...props
}: Props) => {
  const textClassNames = useMemo(() => {
    const classes: string[] = [];
    if (color) {
      classes.push(textColor[color]);
    }

    if (fontSize) {
      classes.push(css({ fontSize }));
    }

    if (fontWeight) {
      classes.push(css({ fontWeight }));
    }

    if (capitalized) {
      classes.push(css({ textTransform: 'capitalize' }));
    }
    if (underline) {
      classes.push(css({ textDecoration: 'underline' }));
    }

    if (center) {
      classes.push(
        css({
          textAlign: 'center',
          display: 'block',
        })
      );
    }

    return clsx(classes);
  }, [props]);

  return <Text {...props} className={clsx(props.className, textClassNames)} />;
};

export default AppText;
