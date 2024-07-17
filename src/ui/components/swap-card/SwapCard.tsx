import { Button, Flex, Form, Input, Modal } from 'antd';
import AppText from '../app-text/AppText';

import { formatCurrency } from '../../../helpers/number';
import { DownOutlined } from '@ant-design/icons';

import styles from './SwapCard.module.scss';
import { Asset } from '../../../types';

type SwapCardProps = {
  balance: number;
  total: number;
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
  // onChange,
  onSelectToken,
}: SwapCardProps) => {
  const form = Form.useFormInstance();
  const token: Asset = form.getFieldValue([type, 'token']);

  return (
    <div className={styles.swapCard}>
      <Flex align={'center'} justify="space-between">
        <AppText fontSize={18} color="grey">
          {title}
        </AppText>
        <div>
          👛 <AppText color="grey">{formatCurrency(balance ?? 0)}</AppText>
        </div>
      </Flex>

      <Flex gap={12}>
        <div className={styles.swapCard_tokenInput}>
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
                    src={token.price}
                    width={30}
                    height={30}
                    className="rounded"
                  />
                  <span>{token.currency}</span>
                </>
              ) : (
                'Select token'
              )}{' '}
              <DownOutlined />
            </Flex>
          </Button>
        </div>
        <Form.Item
          className={styles.swapCard_amountInput}
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
        </AppText>
      </Flex>
    </div>
  );
};

export default SwapCard;
