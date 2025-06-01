import React from 'react';
import { Select, Space } from 'antd';


interface Filterprops {
  onFilterChange: (value: string) => void;
}

const Filter: React.FC<Filterprops> = ({ onFilterChange }) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    onFilterChange(value);
  };
  return (
    <Space wrap>
      <Select
        defaultValue="all"
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'all', label: 'Tất cả' },
          { value: 'on', label: 'Bật' },
          { value: 'off', label: 'Tắt' },
        ]}
      />
    </Space>
  );
}
export default Filter;