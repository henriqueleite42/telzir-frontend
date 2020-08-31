import { ICallPrice } from "Types/CallPrice";
import { ICallFee } from "Types/CallTax";
import { IPlan } from "Types/Plan";

export interface IProps {
  addCallPrice: (callPrice: ICallPrice) => void;
}

export interface ILocalCallsFees {
  status: "error" | "loading" | "success";
  fees: { [DDD: string]: ICallFee };
  plans: { [name: string]: IPlan };
}

export interface ILocalCallPrice {
  from: string;
  to: string;
  duration: string;
  plan: string;
}
