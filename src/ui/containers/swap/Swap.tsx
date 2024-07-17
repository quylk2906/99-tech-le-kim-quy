import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  message,
  Tabs,
  TabsProps,
  Typography,
} from 'antd';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Asset, FormValue, TransactionType } from './types';

import queryString from 'query-string';
import AppText from '../../components/app-text/AppText';
import AssetList from '../../components/asset-list/AssetList';

import SettingIcon from '../../../assets/svg-icons/settings.svg';
import ArrowUpDown from '../../../assets/svg-icons/arrow_up_down.svg';

import SwapCard from '../../components/swap-card/SwapCard';

import DetailCollapse from '../../components/detail-collapse/DetailCollapse';
import SlippagePopUp from '../../components/slippage-popup/SlippagePopUp';

import styles from './Swap.module.scss';

const { Title } = Typography;

type Props = {
  // onSubmit: () => void;
};

const FAVORITE_ASSETS = 'favoriteAssets';

const Swap: FC<Props> = () => {
  const fakeAssets: any[] = [];
  // const { query: routerQuery } = useRouter();
  const routerQuery = queryString.parse(window.location.search);
  console.log(`⚡ ~~ routerQuery`, routerQuery);
  const [form] = Form.useForm<FormValue>();
  const [favoriteAssets, setFavoriteAssets] = useState<string[]>(
    JSON.parse(localStorage.getItem(FAVORITE_ASSETS) ?? '[]')
  );
  const firstSubmitted = useRef(false);
  const currentTokenInput = useRef<TransactionType | ''>('');
  const [keyword, setKeyword] = useState('');
  const { origin, pathname } = useMemo(() => window.location, []);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [slippage, setSlippage] = useState(1);
  const [openSlippage, setOpenSlippage] = useState(false);
  // Note: Send token + amount
  const sendData = Form.useWatch('f', form) ?? {};
  // Note: Receive token + amount
  const receiveData = Form.useWatch('t', form) ?? {};

  const { allAssets, favorites }: { allAssets: Asset[]; favorites: Asset[] } =
    useMemo(() => {
      // TODO: Call api get list asset
      // You can map more data if needed
      const assets = fakeAssets.map((el) => ({
        symbol: el.symbol,
        name: el.display_name,
        logo: el.image_url ?? '',
        address: el.contract_address,
        // TODO: Get user token balance
        balance: 9999,
        price: Number(el.dex_usd_price ?? 0),
        isFavorite: favoriteAssets.includes(el.contract_address),
      }));
      if (!keyword) {
        return {
          allAssets: assets,
          favorites: assets.filter((el) => el.isFavorite),
        };
      }
      return {
        allAssets: assets.filter((el) =>
          `${el.name} ${el.symbol} ${el.address}`
            .toLowerCase()
            .includes(keyword)
        ),
        favorites: assets.filter(
          (el) =>
            el.isFavorite &&
            `${el.name} ${el.symbol} ${el.address}`
              .toLowerCase()
              .includes(keyword)
        ),
      };
    }, [fakeAssets, favoriteAssets, keyword]);

  const updateQuery = useCallback(
    (data: Record<string, any>) => {
      const parsed = queryString.parse(location.search);
      const query = queryString.stringify({ ...parsed, ...data });
      window.history.replaceState({}, '', `${origin}${pathname}?${query}`);
    },
    [sendData, receiveData]
  );

  useEffect(() => {
    if (!isEmpty(routerQuery) && !isEmpty(allAssets)) {
      setSlippage(Number(routerQuery.slippage || '1'));
      if (routerQuery.ft) {
        const token = allAssets.find((el) => el.symbol === `${routerQuery.ft}`);
        form.setFieldValue(['f', 'token'], token);
      }
      if (routerQuery.tt) {
        const token = allAssets.find((el) => el.symbol === `${routerQuery.tt}`);
        form.setFieldValue(['t', 'token'], token);
      }
    }
  }, [routerQuery, allAssets]);

  const handleSubmit = async () => {
    // TODO: Call API transaction
    try {
      firstSubmitted.current = true;
      const data = await form.validateFields();
      console.log(`⚡ ~~ handleSubmit ~~ data`, data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToFav = useCallback(
    (asset: Asset) => {
      let _favoriteAssets = [...favoriteAssets];
      if (isEmpty(_favoriteAssets)) {
        _favoriteAssets = [asset.address];
      } else if (_favoriteAssets.includes(asset.address)) {
        _favoriteAssets = _favoriteAssets.filter((el) => el !== asset.address);
      } else {
        _favoriteAssets.push(asset.address);
      }
      localStorage.setItem(FAVORITE_ASSETS, JSON.stringify(_favoriteAssets));
      setFavoriteAssets(_favoriteAssets);
    },
    [favoriteAssets]
  );

  const { fromBalance, fromTotal } = useMemo(() => {
    return {
      // TODO: Get user token balance
      fromBalance: 11111,
      fromTotal: +(sendData.amount ?? 0) * (sendData.token?.price ?? 0),
    };
  }, [sendData]);

  const { toBalance, toTotal } = useMemo(() => {
    return {
      // TODO: Get user token balance
      toBalance: 33333,
      toTotal: +(receiveData.amount ?? 0) * (receiveData.token?.price ?? 0),
    };
  }, [receiveData]);

  const isValidTransaction =
    sendData.amount &&
    sendData.token?.address &&
    receiveData.amount &&
    receiveData.token?.address;

  const differenceVal = 6.9;

  const handleSearch = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword((ev.target.value ?? '').toLowerCase());
  }, 350);

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
        updateQuery({ ft: token.symbol });
      } else {
        form.setFieldValue(['t', 'token'], token);
        form.resetFields([
          ['f', 'amount'],
          ['t', 'amount'],
        ]);
        updateQuery({ tt: token.symbol });
        if (firstSubmitted.current) {
          form.validateFields();
        }
      }
      setOpenDrawer(false);
    },
    [currentTokenInput, firstSubmitted.current, updateQuery]
  );

  const handleReload = () => {
    // TODO: refetch asset list, implement interval later
    message.success('Reloaded');
  };

  const handleFieldsChange = (val: any) => {
    const fAmount = get(val, ['f', 'amount']);
    const tAmount = get(val, ['t', 'amount']);
    if (!sendData.token?.address || !receiveData.token?.address) {
      return;
    }

    if (fAmount && sendData.token?.address && receiveData.token?.address) {
      // TODO: update logic convert receive amount
      form.setFieldValue(
        ['t', 'amount'],
        +fAmount * (receiveData.token.price ?? 0)
      );
    } else if (
      tAmount &&
      sendData.token?.address &&
      receiveData.token?.address
    ) {
      // TODO: update logic convert send amount
      form.setFieldValue(
        ['f', 'amount'],
        +tAmount * (sendData.token.price ?? 0)
      );
    }
  };

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Favorites',
        children: (
          <AssetList
            assets={favorites}
            onSelectToken={handleSelectToken}
            onAddToFavorite={handleAddToFav}
          />
        ),
      },
      {
        key: '2',
        label: 'All assets',
        children: (
          <AssetList
            assets={allAssets}
            onSelectToken={handleSelectToken}
            onAddToFavorite={handleAddToFav}
          />
        ),
      },
    ],
    [
      favorites,
      allAssets,
      sendData,
      receiveData,
      handleSelectToken,
      handleAddToFav,
    ]
  );

  return (
    <>
      <Flex className={styles.swap} vertical gap={18}>
        <AppText center fontSize={32} color="black" css={{ lineHeight: 1 }}>
          Swap Jetton
          <br /> at the best rate
        </AppText>
        <Flex justify={'flex-end'} gap={8}>
          <Button
            icon={<img src={SettingIcon} className="logo" alt="Vite logo" />}
            onClick={() => setOpenSlippage(true)}
          />
          <Button icon={<ReloadOutlined />} onClick={handleReload} />
        </Flex>
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
            assets={allAssets}
            // onChange={setSendData}
            onSelectToken={() => {
              currentTokenInput.current = 'send';
              setOpenDrawer(true);
            }}
          />
          <Button
            className={styles.swap_button}
            icon={<img src={ArrowUpDown} className="logo" alt="Vite logo" />}
            onClick={handleSwap}
          />
          <SwapCard
            balance={toBalance}
            total={toTotal}
            title="You receive"
            type="t"
            assets={allAssets}
            // onChange={setReceiveData}
            differenceVal={differenceVal}
            onSelectToken={() => {
              currentTokenInput.current = 'receive';
              setOpenDrawer(true);
            }}
          />
        </Form>

        {isValidTransaction && (
          <DetailCollapse
            sendToken={sendData.token?.symbol ?? ''}
            sendPrice={sendData.amount ?? 0}
            receiveToken={receiveData.token?.symbol ?? ''}
            receivePrice={receiveData.amount ?? 0}
            slippage={slippage}
            // TODO: Update correct number
            minimumAmount={999.999}
            priceImpact={0.00999}
            fee={[0.066665, 0.266665]}
            // alert="error"
            alert="warning"
          />
        )}

        <Button onClick={handleSubmit}>Send transaction</Button>
      </Flex>

      <Drawer
        height="auto"
        open={openDrawer}
        rootClassName={styles.swap_drawer}
        onClose={() => {
          setOpenDrawer(false);
        }}
      >
        <Title level={4} className="mb-1">
          Select token
        </Title>

        <Flex vertical align={'center'} gap={16}>
          <Input
            css={{
              borderRadius: 24,
              '.ant-input-prefix': {
                marginInlineEnd: 10,
              },
            }}
            placeholder="Search assets or address"
            prefix={<SearchOutlined />}
            onChange={handleSearch}
          />
        </Flex>

        <Tabs defaultActiveKey="1" items={items} />
      </Drawer>

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
