import { ReloadOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Spin, message } from 'antd';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import queryString from 'query-string';
import AppText from '../../components/app-text/AppText';

import SettingIcon from '../../../assets/svg-icons/settings.svg';
import ArrowUpDown from '../../../assets/svg-icons/arrow_up_down.svg';

import SwapCard from '../../components/swap-card/SwapCard';

import DetailCollapse from '../../components/detail-collapse/DetailCollapse';
import SlippagePopUp from '../../components/slippage-popup/SlippagePopUp';

import styles from './Swap.module.scss';
import { Asset, FormValue, TransactionType } from '../../../types';
import TokenSelection from '../../components/token-selection/TokenSelection';
import { getTokens, swapToken } from '../../../api/index';

type Props = {
  //
};

const Swap: FC<Props> = () => {
  const routerQuery = queryString.parse(window.location.search);
  const [form] = Form.useForm<FormValue>();
  // TODO: Use API hooks later
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const currentTokenInput = useRef<TransactionType | ''>('');
  const { origin, pathname } = useMemo(() => window.location, []);
  const [slippage, setSlippage] = useState(1);
  const [tokens, setTokens] = useState<Asset[]>([]);
  const [openSlippage, setOpenSlippage] = useState(false);
  // Note: Send token + amount
  const sendData = Form.useWatch('f', form) ?? {};
  // Note: Receive token + amount
  const receiveData = Form.useWatch('t', form) ?? {};

  const updateQuery = useCallback(
    (data: Record<string, any>) => {
      const parsed = queryString.parse(location.search);
      const query = queryString.stringify({ ...parsed, ...data });
      window.history.replaceState({}, '', `${origin}${pathname}?${query}`);
    },
    [sendData, receiveData]
  );

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const rs = await getTokens();
      setTokens(rs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  // Hooks to update url
  useEffect(() => {
    if (!isEmpty(routerQuery) && !isEmpty(tokens)) {
      setSlippage(Number(routerQuery.slippage || '1'));
      if (routerQuery.ft) {
        const token = tokens.find((el) => el.currency === `${routerQuery.ft}`);
        form.setFieldValue(['f', 'token'], token);
      }
      if (routerQuery.tt) {
        const token = tokens.find((el) => el.currency === `${routerQuery.tt}`);
        form.setFieldValue(['t', 'token'], token);
      }
    }
  }, [tokens]);

  const handleSubmit = async () => {
    // TODO: Call API transaction
    try {
      setSubmitting(true);
      await form.validateFields();
      await swapToken();
      message.success('Swap token successful');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const { fromBalance, fromTotal } = useMemo(() => {
    return {
      // TODO: Get user token balance
      fromBalance: 45,
      fromTotal: +(sendData.amount ?? 0) * (sendData.token?.price ?? 0),
    };
  }, [sendData]);

  const { toBalance, toTotal } = useMemo(() => {
    return {
      // TODO: Get user token balance
      toBalance: 12,
      toTotal: +(receiveData.amount ?? 0) * (receiveData.token?.price ?? 0),
    };
  }, [receiveData]);

  const isValidTransaction =
    sendData.amount &&
    sendData.token?.currency &&
    receiveData.amount &&
    receiveData.token?.currency;

  const handleSwap = () => {
    const { f, t } = form.getFieldsValue();
    form.setFieldValue('f', t);
    form.setFieldValue('t', f);
  };

  const handleSelectToken = useCallback(
    (token: Asset) => {
      if (currentTokenInput.current === 'send') {
        form.resetFields();
        form.setFieldValue(['f', 'token'], token);
        updateQuery({ ft: token.currency });
      } else {
        form.setFieldValue(['t', 'token'], token);
        form.resetFields([
          ['f', 'amount'],
          ['t', 'amount'],
        ]);
        updateQuery({ tt: token.currency });
      }
      setOpenDrawer(false);
    },
    [currentTokenInput, updateQuery]
  );

  const handleReload = () => {
    // TODO: refetch asset list, implement interval later
    message.success('Reloaded');
  };

  const handleFieldsChange = (val: any) => {
    const fAmount = get(val, ['f', 'amount']);
    const tAmount = get(val, ['t', 'amount']);
    if (!sendData.token?.currency || !receiveData.token?.currency) {
      return;
    }

    if (fAmount && sendData.token?.currency && receiveData.token?.currency) {
      // TODO: update logic convert receive amount
      form.setFieldValue(
        ['t', 'amount'],
        +fAmount * (receiveData.token.price ?? 0)
      );
    } else if (
      tAmount &&
      sendData.token?.currency &&
      receiveData.token?.currency
    ) {
      // TODO: update logic convert send amount
      form.setFieldValue(
        ['f', 'amount'],
        +tAmount * (sendData.token.price ?? 0)
      );
    }
  };

  return (
    <>
      <div className={styles.swap}>
        <div className={styles.swap_body}>
          <AppText center fontSize={32} color="primary" css={{ lineHeight: 1 }}>
            Swap your token
          </AppText>
          <Flex justify={'flex-end'} gap={8}>
            <Button
              icon={<img src={SettingIcon} className="logo" alt="Vite logo" />}
              onClick={() => setOpenSlippage(true)}
            />
            <Button icon={<ReloadOutlined />} onClick={handleReload} />
          </Flex>
          <Spin spinning={loading}>
            <Form
              className={styles.swap_form}
              form={form}
              onValuesChange={handleFieldsChange}
            >
              <SwapCard
                balance={fromBalance}
                total={fromTotal}
                title="You send"
                type="f"
                assets={tokens}
                // onChange={setSendData}
                onSelectToken={() => {
                  currentTokenInput.current = 'send';
                  setOpenDrawer(true);
                }}
              />
              <Button
                className={styles.swap_button}
                icon={
                  <img src={ArrowUpDown} className="logo" alt="Vite logo" />
                }
                onClick={handleSwap}
              />
              <SwapCard
                balance={toBalance}
                total={toTotal}
                title="You receive"
                type="t"
                assets={tokens}
                onSelectToken={() => {
                  currentTokenInput.current = 'receive';
                  setOpenDrawer(true);
                }}
              />
            </Form>
          </Spin>

          {isValidTransaction && (
            <div css={{ width: '100%' }}>
              <DetailCollapse
                sendToken={sendData.token?.currency ?? ''}
                sendPrice={sendData.amount ?? 0}
                receiveToken={receiveData.token?.currency ?? ''}
                receivePrice={receiveData.amount ?? 0}
                slippage={slippage}
                // TODO: Update correct number
                minimumAmount={999.999}
                priceImpact={0.00999}
                fee={[0.066665, 0.266665]}
                // alert="error"
                alert="warning"
              />
            </div>
          )}

          <Button
            block
            loading={submitting}
            type="primary"
            onClick={handleSubmit}
            size="large"
            css={{ borderRadius: 24 }}
          >
            Send transaction
          </Button>
        </div>
      </div>

      <TokenSelection
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSelectToken={handleSelectToken}
        assets={tokens}
      />

      <SlippagePopUp
        defaultValue={slippage}
        open={openSlippage}
        onCancel={() => setOpenSlippage(false)}
        onSubmit={(slippage) => {
          setSlippage(slippage);
          updateQuery({
            slippage,
          });
        }}
      />
    </>
  );
};

export default Swap;
