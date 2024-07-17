import {
  CheckCircleOutlined,
  InfoCircleFilled,
  SwapOutlined,
} from '@ant-design/icons';
import { Button, Collapse, CollapseProps, Flex, Tooltip } from 'antd';
import { FC, useMemo, useState } from 'react';
import clsx from 'clsx';

import AppText from '../app-text/AppText';
import { formatCurrency } from '../../../helpers/number';

import styles from './DetailCollapse.module.scss';

type Props = {
  sendToken: string;
  sendPrice: number;
  receiveToken: string;
  receivePrice: number;
  slippage: number;
  minimumAmount: number;
  priceImpact: number;
  usdRate?: number;
  fee: number[];
  alert?: 'error' | 'warning';
};

const rounderNumber = (val: number) =>
  val.toLocaleString('en', { maximumFractionDigits: 3 });

const DetailCollapse: FC<Props> = (props) => {
  const {
    sendToken,
    sendPrice,
    receiveToken,
    receivePrice,
    slippage,
    minimumAmount,
    priceImpact,
    fee,
    alert,
  } = props;

  const infoIcon = <InfoCircleFilled css={{ marginLeft: 4 }} />;

  const [swapped, setSwapped] = useState(false);

  const info = useMemo(() => {
    if (swapped) {
      return (
        <AppText color="black">
          {/* TODO: Calculate to dollar */}
          {`1 ${sendToken} ≈ ${rounderNumber(
            receivePrice
          )} ${receiveToken}`}{' '}
          <AppText color="grey">(${rounderNumber(receivePrice)})</AppText>
        </AppText>
      );
    }
    return (
      <AppText color="black">
        {/* TODO: Calculate to dollar */}
        {`1 ${receiveToken} ≈ ${rounderNumber(sendPrice)} ${sendToken}`}{' '}
        <AppText color="grey">(${rounderNumber(sendPrice)})</AppText>
      </AppText>
    );
  }, [
    swapped,
    sendToken,
    sendPrice,
    receiveToken,
    receivePrice,
    slippage,
    minimumAmount,
    priceImpact,
    fee,
    alert,
  ]);

  const collapseItems: CollapseProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: (
          <>
            <span className={'header--expanded'}>
              <AppText strong fontSize={16}>
                Swap detail
              </AppText>
            </span>

            <Flex align={'center'} className={'header--collapsed'} gap={6}>
              <CheckCircleOutlined color="green" />
              {info}
              <Button
                size="small"
                type="text"
                icon={<SwapOutlined />}
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSwapped((prev) => !prev);
                }}
              />
            </Flex>
          </>
        ),
        children: (
          <div>
            <Flex justify={'space-between'}>
              <AppText color="black">1 {sendToken} price</AppText>
              <AppText strong color="black">
                ≈ {formatCurrency(sendPrice)} {receiveToken}{' '}
                <AppText color="grey">{`(<$0.01)`}</AppText>
              </AppText>
            </Flex>
            <Flex justify={'space-between'}>
              <AppText color="black">1 {receiveToken} price</AppText>
              <AppText strong color="black">
                ≈ {formatCurrency(receivePrice)} {sendToken}{' '}
                <AppText color="grey">{`($1)`}</AppText>
              </AppText>
            </Flex>

            <Flex justify={'space-between'}>
              <AppText color="black">
                Max. slippage{' '}
                <Tooltip
                  title={`Your transaction will not be executed if the price changes unfavorably beyond ${slippage}%`}
                >
                  {infoIcon}
                </Tooltip>
              </AppText>
              <AppText strong color="black">
                {slippage}%
              </AppText>
            </Flex>

            <Flex justify={'space-between'}>
              <AppText color="black">
                Minimum received{' '}
                <Tooltip
                  title={`Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.`}
                >
                  {infoIcon}
                </Tooltip>
              </AppText>
              <AppText strong color="black">
                {minimumAmount.toFixed(6)}
              </AppText>
            </Flex>

            <Flex
              justify={'space-between'}
              className={clsx(
                alert === 'error' && styles['priceImpact--error'],
                alert === 'warning' && styles['priceImpact--warning']
              )}
            >
              <AppText color="black">
                Price impact{' '}
                <Tooltip
                  title={`The difference between the market price and estimated price due to trade size.`}
                >
                  {infoIcon}
                </Tooltip>
              </AppText>
              <AppText strong color="black">
                {priceImpact.toFixed(3)}%
              </AppText>
            </Flex>

            {fee && (
              <Flex justify={'space-between'}>
                <AppText color="black">Blockchain fee</AppText>
                <AppText strong color="black">
                  {fee[0].toFixed(3)} - {fee[1].toFixed(3)} TON
                </AppText>
              </Flex>
            )}
          </div>
        ),
      },
    ],
    [
      sendToken,
      sendPrice,
      receiveToken,
      receivePrice,
      slippage,
      minimumAmount,
      priceImpact,
      fee,
      info,
    ]
  );
  return (
    <Collapse
      items={collapseItems}
      bordered={false}
      expandIconPosition="end"
      className={styles.collapse}
    />
  );
};

export default DetailCollapse;
