export interface SelectedCar {
  category: string;
  specs: {
    passengers: number;
    transmission: string;
    plan: string;
    consumption: string;
  };
  price: string;
  period: string;
}