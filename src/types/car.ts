export interface SelectedCar {
  name: string;
  category: string;
  price: number;
  period?: string;
  specs?: {
    passengers?: number;
    transmission?: string;
    plan?: string;
    consumption?: string;
  };
}