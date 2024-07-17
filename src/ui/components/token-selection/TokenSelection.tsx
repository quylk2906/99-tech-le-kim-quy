import {
  Drawer,
  Flex,
  Input,
  List,
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

const { Title } = Typography;
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
  // favorites Asset[];
  // allAssets: Asset[];
  onSelectToken: (val: Asset) => void;
  // onAddToFavorite: (val: Asset) => void;
  // onSelectToken: (val: Asset) => void;
  // onAddToFavorite: (val: Asset) => void;
};

const AssetList: FC<AssetListProps> = ({
  assets,
  onSelectToken,
  onAddToFavorite,
}) => {
  const ContainerHeight = useMemo(() => window.innerHeight - 280, []);
  return (
    <List>
      <VirtualList
        data={assets}
        height={ContainerHeight}
        itemHeight={56}
        itemKey="address"
      >
        {(el: Asset) => (
          <List.Item key={el.currency} onClick={() => onSelectToken(el)}>
            <Flex gap={12} align="center">
              {/* <img
                src={el.logo}
                width={32}
                height={32}
                className="rounded shrink-0"
              /> */}
              <Flex vertical className="grow-1" gap={2} css={{ width: 150 }}>
                <AppText strong color="black" fontSize={16}>
                  {el.currency}
                </AppText>
              </Flex>
              <Flex vertical className="text-right">
                <AppText strong color="black" fontSize={16}>
                  ${rounderNumber(el.price)}
                </AppText>
                <AppText color="grey" fontSize={16}>
                  $
                  {el.price < 1 ? el.price.toFixed(4) : rounderNumber(el.price)}
                </AppText>
              </Flex>
              <div
                onClick={(ev) => {
                  ev.stopPropagation();
                }}
              >
                <Rate
                  count={1}
                  defaultValue={el.isFavorite ? 1 : 0}
                  onChange={() => {
                    onAddToFavorite(el);
                  }}
                  character={() => <StarFilled css={{ fontSize: 16 }} />}
                />
              </div>
            </Flex>
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};

const TokenSelection: FC<TokenSelectionProps> = (props) => {
  const { assets, open, onSelectToken, onClose } = props;
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
    }, [assets, keyword]);

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

  return (
    <Drawer
      height="auto"
      open={open}
      rootClassName={styles.tokenSelection_drawer}
      onClose={onClose}
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
  );
};

export default TokenSelection;
