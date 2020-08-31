import { Input } from "antd";
import { InputProps } from "antd/lib/input/Input";
import React, { useCallback } from "react";

const NumericInput: React.FC<InputProps> = props => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { onChange } = props;

      if (!onChange) return;

      const value = event.target.value;

      if (value.length > 0 && !/^\d+$/.test(value)) return;

      onChange(event);
    },
    [props],
  );

  return <Input {...props} onChange={handleChange} />;
};

export default NumericInput;
