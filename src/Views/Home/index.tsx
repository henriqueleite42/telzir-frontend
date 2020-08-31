import React, { useState } from "react";

import CallPriceCalculator from "Components/CallPriceCalculator";
import CallsPricesList from "Components/CallsPricesList";

import { ICallPrice } from "Types/CallPrice";

import { Container } from "./style";

const Home: React.FC = () => {
  const [data, setData] = useState<Array<ICallPrice>>([]);

  return (
    <Container>
      <CallPriceCalculator
        addCallPrice={callPrice =>
          setData(prevState => [callPrice, ...prevState])
        }
      />
      <CallsPricesList data={data} />
    </Container>
  );
};

export default Home;
