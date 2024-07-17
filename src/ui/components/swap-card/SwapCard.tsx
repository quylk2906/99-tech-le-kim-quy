import { Button, Flex, Form, Input, Modal } from 'antd';
import { Asset } from '../../containers/swap/types';
import clsx from 'clsx';
import AppText from '../app-text/AppText';

import { formatCurrency } from '../../../helpers/number';
import { DownOutlined } from '@ant-design/icons';

import styles from './SwapCard.module.scss';

type SwapCardProps = {
  balance: number;
  total: number;
  differenceVal?: number;
  title: string;
  type: 'f' | 't';
  assets: Asset[];
  // onChange: (val: PairInput) => void;
  onSelectToken: () => void;
};

const NumberInput = (props: any) => (
  <Input
    inputMode="decimal"
    {...props}
    onChange={(event: any) => {
      const formattedVal = event.target.value.replace(/,/g, '.');
      props.onChange(formattedVal);
    }}
  />
);

const SwapCard = ({
  title,
  type,
  balance,
  total,
  differenceVal,
  // onChange,
  onSelectToken,
}: SwapCardProps) => {
  const form = Form.useFormInstance();
  const token: Asset = form.getFieldValue([type, 'token']);

  const handleShowDifferExplain = () => {
    Modal.info({
      okText: 'Got it, thanks',
      title: 'What is Value difference?',
      okButtonProps: { className: 'bg-blue--dark' },
      content: (
        <div>
          <AppText color="black">
            Value difference = (Received value - Paid value) / Paid value.
          </AppText>
          <br />
          <br />
          <AppText color="black">
            When you trade a certain amount of tokens, it affects the liquidity
            pool's depth. This, in turn, changes the overall availability and
            price of the tokens, leading to noticeable differences in prices.
          </AppText>
        </div>
      ),
    });
  };

  return (
    <div className={styles.swapCard_card}>
      <Flex align={'center'} justify="space-between">
        <AppText fontSize={24} color="grey">
          {title}
        </AppText>
        <div>
          👛 <AppText color="grey">{formatCurrency(balance ?? 0)}</AppText>
        </div>
      </Flex>

      <Flex gap={12} css={{ marginTop: -8 }}>
        <div className={styles.swapCard_amountInput}>
          <Form.Item
            css={{ width: 116 }}
            name={[type, 'token']}
            rules={[{ required: true, message: 'Please select' }]}
          >
            <Input css={{ visibility: 'hidden' }} />
          </Form.Item>
          <Button onClick={onSelectToken} size="large">
            <Flex gap={8} align="center">
              {token ? (
                <>
                  <img
                    src={token.logo}
                    width={30}
                    height={30}
                    className="rounded"
                  />
                  <span>{token.symbol}</span>
                </>
              ) : (
                'Select token'
              )}{' '}
              <DownOutlined />
            </Flex>
          </Button>
        </div>
        <Form.Item
          css={{
            marginBottom: -14,
            '.ant-form-item-explain-error': {
              textAlign: 'right',
            },
          }}
          className="grow-1"
          name={[type, 'amount']}
          rules={[{ required: true, message: 'Please input' }]}
        >
          <NumberInput
            placeholder="0"
            // onChange={handleChange}
            className="text-right"
          />
        </Form.Item>
      </Flex>

      <Flex justify={'flex-end'}>
        <AppText color="grey">
          ${!total ? 0 : formatCurrency(Number(total.toFixed(6)))}{' '}
          {differenceVal ? (
            <span
              onClick={handleShowDifferExplain}
              className={clsx(
                'cursor',
                differenceVal > 0 ? 'text-green' : 'text-red'
              )}
            >
              ({differenceVal}%)
            </span>
          ) : null}
        </AppText>
      </Flex>
    </div>
  );
};

export default SwapCard;
