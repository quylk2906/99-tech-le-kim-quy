import { Flex, List, Rate, Typography } from 'antd';
import { FC, useMemo } from 'react';
import VirtualList from 'rc-virtual-list';
import { StarFilled } from '@ant-design/icons';

const { Link } = Typography;

type AssetListProps = {
  assets: Asset[];
  onSelectToken: (val: Asset) => void;
  onAddToFavorite: (val: Asset) => void;
};

const Arrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.1893 4.75L5.15556 4.75C4.74134 4.75 4.40556 4.41421 4.40556 4C4.40556 3.58579 4.74134 3.25 5.15556 3.25L12 3.25C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4V10.8444C12.75 11.2587 12.4142 11.5944 12 11.5944C11.5858 11.5944 11.25 11.2587 11.25 10.8444V5.81066L4.53033 12.5303C4.23744 12.8232 3.76256 12.8232 3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L10.1893 4.75Z"
      fill="currentColor"
    />
  </svg>
);

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
          <List.Item key={el.address} onClick={() => onSelectToken(el)}>
            <Flex gap={12} align="center">
              <img
                src={el.logo}
                width={32}
                height={32}
                className="rounded shrink-0"
              />
              <Flex vertical className="grow-1" gap={2} css={{ width: 150 }}>
                <PoolText strong color="black" fontSize={16}>
                  {el.symbol}
                </PoolText>
                <Flex>
                  <PoolText ellipsis color="grey">
                    {el.name}
                  </PoolText>
                  <Link
                    css={{ marginLeft: 4 }}
                    className="ml-1 text-grey"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      openExternalLink(`https://tonviewer.com/${el.address}`);
                    }}
                  >
                    <Arrow />
                  </Link>
                </Flex>
              </Flex>
              <Flex vertical className="text-right">
                <PoolText strong color="black" fontSize={16}>
                  ${formatCurrency(el.balance)}
                </PoolText>
                <PoolText color="grey" fontSize={16}>
                  $
                  {el.price < 1
                    ? el.price.toFixed(4)
                    : formatCurrency(el.price)}
                </PoolText>
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

export default AssetList;
