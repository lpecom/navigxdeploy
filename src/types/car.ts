export interface SelectedCar {
  name: string;
  category: string;
  price: number;
  specs?: {
    passengers?: number;
    transmission?: string;
    plan?: string;
    consumption?: string;
  };
}