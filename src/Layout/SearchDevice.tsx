import React from 'react';
// import './index.css';
import { Input, Space } from 'antd';
import type { GetProps } from 'antd';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const SearchDevice: React.FC = () => (
  <Space direction="vertical">
    <Search placeholder="Input search text" onSearch={onSearch} enterButton />
  </Space>
);

export default SearchDevice;