import { Table } from "antd";
import React from "react";

import { maskBRL } from "Utils/Money";

import { ICallPrice } from "Types/CallPrice";

const sorter = (column: keyof ICallPrice) => (a: ICallPrice, b: ICallPrice) => {
  let value1 = a[column];
  let value2 = b[column];

  if (typeof value1 === "string") {
    value1 = parseInt(value1);
  }
  if (typeof value2 === "string") {
    value2 = parseInt(value2);
  }

  return value1 - value2;
};

const columns = [
  {
    title: "DDD de Origem",
    dataIndex: "from",
    key: "from",
    sorter: sorter("from"),
  },
  {
    title: "DDD de Destino",
    dataIndex: "to",
    key: "to",
    sorter: sorter("to"),
  },
  {
    title: "Taxa",
    dataIndex: "fee",
    key: "fee",
    render: (value: number) => maskBRL(value),
    sorter: sorter("fee"),
  },
  {
    title: "Taxa com o Plano",
    dataIndex: "feeWithPlan",
    key: "feeWithPlan",
    render: (value: number) => maskBRL(value),
    sorter: sorter("feeWithPlan"),
  },
  {
    title: "Tempo",
    dataIndex: "duration",
    key: "duration",
  },
  {
    title: "Plano",
    dataIndex: "plan",
    key: "plan",
  },
  {
    title: "Valor com Plano",
    dataIndex: "priceWithPlan",
    key: "priceWithPlan",
    render: (value: number) => maskBRL(value),
    sorter: sorter("priceWithPlan"),
  },
  {
    title: "Valor sem Plano",
    dataIndex: "priceDefault",
    key: "priceDefault",
    render: (value: number) => maskBRL(value),
    sorter: sorter("priceDefault"),
  },
];

interface IProps {
  data: Array<ICallPrice>;
}

const CallsPricesList: React.FC<IProps> = ({ data }) => {
  return (
    <Table
      columns={columns}
      dataSource={data.map(data => ({
        ...data,
        key: data.id,
      }))}
      pagination={false}
    />
  );
};

export default CallsPricesList;
