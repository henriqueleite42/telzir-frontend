import { Dropdown, Menu, Button } from "antd";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import Swal from "sweetalert2";

import { ILocalCallsFees, ILocalCallPrice, IProps } from "./types";

import NumericInput from "Components/NumericInput";

import { Container } from "./style";

const CallPriceCalculator: React.FC<IProps> = ({ addCallPrice }) => {
  const [pricesData, setPricesData] = useState<ILocalCallsFees>({
    status: "loading",
    fees: {},
    plans: {},
  });
  const [state, setState] = useState<ILocalCallPrice>({
    from: "",
    to: "",
    duration: "",
    plan: "",
  });

  /**
   *
   * Handle Events
   *
   */

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const { from, to, duration, plan } = state;
      const { fees, plans } = pricesData;

      let errorMessage = "";

      if (!from) {
        errorMessage = "É preciso escolher a origem.";
      } else if (!to) {
        errorMessage = "É preciso escolher o destino.";
      } else if (!duration) {
        errorMessage = "É preciso preencher o tempo.";
      } else if (!plan) {
        errorMessage = "É preciso escolher o plano.";
      }

      if (errorMessage) {
        Swal.fire({
          title: errorMessage,
          icon: "error",
        });

        return;
      }

      const durationInt = parseInt(duration);
      const fee = fees[from].fees[to];
      const feeWithPlan = fee * 1.1;
      const freeTime = plans[plan].freeTime;

      // Adds 10% to the fee
      let priceWithPlan = (durationInt - freeTime) * feeWithPlan;
      let priceDefault = durationInt * fee;

      if (priceWithPlan < 0) priceWithPlan = 0;
      if (priceDefault < 0) priceDefault = 0;

      addCallPrice({
        id: new Date().getTime().toString(),
        duration: durationInt,
        from,
        to,
        plan,
        fee,
        feeWithPlan,
        priceWithPlan,
        priceDefault,
      });
    },
    [addCallPrice, pricesData, state],
  );

  const handleChange = useCallback(
    (field: keyof ILocalCallPrice, value: string) => {
      setState(prevState => ({
        ...prevState,
        [field]: value,
      }));
    },
    [],
  );

  /**
   *
   * Get Data To Render
   *
   */

  const getFromOptions = useMemo(() => {
    if (pricesData.status === "success") {
      return Object.values(pricesData.fees).map(({ name, DDD }) => (
        <Menu.Item
          key={DDD}
          onClick={() => handleChange("from", DDD)}
        >{`${DDD} - ${name}`}</Menu.Item>
      ));
    }

    return <></>;
  }, [pricesData.status, pricesData.fees, handleChange]);

  const getToOptions = useMemo(() => {
    if (
      pricesData.status === "success" &&
      state.from &&
      pricesData.fees[state.from]
    ) {
      return Object.keys(pricesData.fees[state.from].fees).map(DDD => (
        <Menu.Item
          key={DDD}
          onClick={() => handleChange("to", DDD)}
        >{`${pricesData.fees[DDD].DDD} - ${pricesData.fees[DDD].name}`}</Menu.Item>
      ));
    }

    return <></>;
  }, [pricesData.status, pricesData.fees, handleChange, state.from]);

  const getPlanOptions = useMemo(() => {
    if (pricesData.status === "success") {
      return Object.values(pricesData.plans).map(plan => (
        <Menu.Item
          key={plan.name}
          onClick={() => handleChange("plan", plan.name)}
        >
          {plan.name}
        </Menu.Item>
      ));
    }

    return <></>;
  }, [pricesData.plans, pricesData.status, handleChange]);

  /**
   *
   * Get Buttons Text
   *
   */

  const getFromButtonText = useMemo(() => {
    if (
      pricesData.status === "success" &&
      state.from &&
      pricesData.fees[state.from]
    ) {
      return `${pricesData.fees[state.from].DDD} - ${
        pricesData.fees[state.from].name
      }`;
    }

    return "DDD de Origem";
  }, [pricesData.status, pricesData.fees, state.from]);

  const getToButtonText = useMemo(() => {
    if (
      pricesData.status === "success" &&
      state.to &&
      pricesData.fees[state.to]
    ) {
      return `${pricesData.fees[state.to].DDD} - ${
        pricesData.fees[state.to].name
      }`;
    }

    return "DDD de Destino";
  }, [pricesData.status, pricesData.fees, state.to]);

  const getPlanButtonText = useMemo(() => {
    if (
      pricesData.status === "success" &&
      state.plan &&
      pricesData.plans[state.plan]
    ) {
      return pricesData.plans[state.plan].name;
    }

    return "Plano";
  }, [pricesData.plans, pricesData.status, state.plan]);

  /**
   *
   * Check if is Disabled
   *
   */

  const isFromDropDownDisabled = useMemo(() => {
    return pricesData.status !== "success";
  }, [pricesData.status]);

  const isToDropDownDisabled = useMemo(() => {
    return pricesData.status !== "success" || !pricesData.fees[state.from];
  }, [pricesData.status, pricesData.fees, state.from]);

  const isPlanDropDownDisabled = useMemo(() => {
    return pricesData.status !== "success";
  }, [pricesData.status]);

  /**
   *
   * useEffects
   *
   */

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const callsFeesData = require("../../Assets/Data/CallTax.json");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const plansData = require("../../Assets/Data/Plans.json");

    const callsFeesOrganized: ILocalCallsFees["fees"] = {};
    const plansOrganized: ILocalCallsFees["plans"] = {};

    for (const fee of callsFeesData) {
      callsFeesOrganized[fee.DDD] = fee;
    }

    for (const plan of plansData) {
      plansOrganized[plan.name] = plan;
    }

    setPricesData({
      status: "success",
      fees: callsFeesOrganized,
      plans: plansOrganized,
    });
  }, []);

  /**
   *
   * Render
   *
   */

  return (
    <Container onSubmit={handleSubmit}>
      <Dropdown
        disabled={isFromDropDownDisabled}
        overlay={<Menu>{getFromOptions}</Menu>}
      >
        <Button>{getFromButtonText}</Button>
      </Dropdown>

      <Dropdown
        disabled={isToDropDownDisabled}
        overlay={<Menu>{getToOptions}</Menu>}
      >
        <Button>{getToButtonText}</Button>
      </Dropdown>

      <NumericInput
        placeholder="Tempo"
        value={state.duration}
        onChange={event => handleChange("duration", event.target.value)}
      />

      <Dropdown
        disabled={isPlanDropDownDisabled}
        overlay={<Menu>{getPlanOptions}</Menu>}
      >
        <Button>{getPlanButtonText}</Button>
      </Dropdown>

      <Button type="primary" htmlType="submit">
        Calcular
      </Button>
    </Container>
  );
};

export default CallPriceCalculator;
