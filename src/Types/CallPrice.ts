export interface ICallPrice {
  id: string;
  from: string;
  to: string;
  fee: number;
  feeWithPlan: number;
  duration: number;
  plan: string;
  priceWithPlan: number;
  priceDefault: number;
}
