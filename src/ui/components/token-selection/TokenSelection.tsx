import {
  Drawer,
  Flex,
  Grid,
  Input,
  List,
  Modal,
  Rate,
  Tabs,
  TabsProps,
  Typography,
} from 'antd';
import { FC, useCallback, useMemo, useState } from 'react';
import VirtualList from 'rc-virtual-list';
import { SearchOutlined, StarFilled } from '@ant-design/icons';
import { Asset } from '../../../types';
import debounce from 'lodash/debounce';
import styles from './TokenSelection.module.scss';
import { isEmpty } from 'lodash';
import AppText from '../app-text/AppText';
import { rounderNumber } from '../../../helpers/number';
const { useBreakpoint } = Grid;
const FAVORITE_ASSETS = 'favoriteAssets';

type AssetListProps = {
  assets: Asset[];
  onSelectToken: (val: Asset) => void;
  onAddToFavorite: (val: Asset) => void;
};

type TokenSelectionProps = {
  open: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectToken: (val: Asset) => void;
};

const AssetList: FC<AssetListProps> = ({
  assets,
  onSelectToken,
  onAddToFavorite,
}) => {
  const ContainerHeight = useMemo(() => 440, []);
  return (
    <List>
      <VirtualList
        data={assets}
        height={ContainerHeight}
        itemHeight={56}
        itemKey="currency"
      >
        {(el: Asset) => (
          <List.Item key={el.currency} onClick={() => onSelectToken(el)}>
            <Flex gap={12} align="center">
              <img
                src={`src/assets/tokens/${el.currency}.svg`}
                width={32}
                height={32}
              />
              <AppText strong color="black" fontSize={16}>
                {el.currency}
              </AppText>
            </Flex>
            <Flex vertical css={{ textAlign: 'right', marginLeft: 'auto' }}>
              <AppText strong color="black" fontSize={16}>
                ${rounderNumber(el.price)}
              </AppText>
              <AppText color="grey" fontSize={16}>
                ${el.price < 1 ? el.price.toFixed(4) : rounderNumber(el.price)}
              </AppText>
            </Flex>
            <div
              onClick={(ev) => {
                ev.stopPropagation();
              }}
            >
              <Rate
                count={1}
                value={el.isFavorite ? 1 : 0}
                onChange={() => {
                  onAddToFavorite(el);
                }}
                character={() => <StarFilled css={{ fontSize: 16 }} />}
              />
            </div>
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};

const TokenSelection: FC<TokenSelectionProps> = (props) => {
  const { assets, open, onSelectToken, onClose } = props;
  const { lg } = useBreakpoint();
  const [keyword, setKeyword] = useState('');

  const [favoriteAssets, setFavoriteAssets] = useState<string[]>(
    JSON.parse(localStorage.getItem(FAVORITE_ASSETS) ?? '[]')
  );

  const handleAddToFav = useCallback(
    (asset: Asset) => {
      let _favoriteAssets = [...favoriteAssets];
      if (isEmpty(_favoriteAssets)) {
        _favoriteAssets = [asset.currency];
      } else if (_favoriteAssets.includes(asset.currency)) {
        _favoriteAssets = _favoriteAssets.filter((el) => el !== asset.currency);
      } else {
        _favoriteAssets.push(asset.currency);
      }
      localStorage.setItem(FAVORITE_ASSETS, JSON.stringify(_favoriteAssets));
      setFavoriteAssets(_favoriteAssets);
    },
    [favoriteAssets]
  );

  const { allAssets, favorites }: { allAssets: Asset[]; favorites: Asset[] } =
    useMemo(() => {
      // TODO: Call api get list asset
      // You can map more data if needed
      const _assets = assets.map((el) => ({
        ...el,
        isFavorite: favoriteAssets.includes(el.currency),
      }));
      if (!keyword) {
        return {
          allAssets: _assets,
          favorites: _assets.filter((el) => el.isFavorite),
        };
      }
      return {
        allAssets: assets.filter((el) =>
          `${el.currency}`.toLowerCase().includes(keyword)
        ),
        favorites: assets.filter(
          (el) =>
            el.isFavorite && `${el.currency}`.toLowerCase().includes(keyword)
        ),
      };
    }, [assets, keyword, favoriteAssets]);

  const handleSearch = debounce((ev: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword((ev.target.value ?? '').toLowerCase());
  }, 350);

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Favorites',
        children: (
          <AssetList
            assets={favorites}
            onSelectToken={onSelectToken}
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
            onSelectToken={onSelectToken}
            onAddToFavorite={handleAddToFav}
          />
        ),
      },
    ],
    [favorites, allAssets]
  );

  const modalContent = useMemo(
    () => (
      <>
        <Flex vertical align={'center'} gap={16}>
          <Input
            size="large"
            placeholder="Search token"
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            css={{
              borderRadius: 24,
              '.ant-input-prefix': {
                marginInlineEnd: 10,
              },
            }}
          />
        </Flex>
        <Tabs defaultActiveKey="1" items={items} />
      </>
    ),
    [handleSearch, items]
  );

  return lg ? (
    <Modal
      centered
      open={open}
      onClose={onClose}
      onOk={onClose}
      onCancel={onClose}
      title="Select token"
      rootClassName={styles.tokenSelection_drawer}
    >
      <div css={{ height: 560 }}>{modalContent}</div>
    </Modal>
  ) : (
    <Drawer
      height={640}
      placement="bottom"
      open={open}
      onClose={onClose}
      title="Select token"
      rootClassName={styles.tokenSelection_drawer}
    >
      {modalContent}
    </Drawer>
  );
};

export default TokenSelection;
