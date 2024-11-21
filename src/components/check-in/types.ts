export interface PhotoCategory {
  id: string;
  label: string;
}

export interface SelectedCar {
  name: string;
  [key: string]: any;
}

export interface CheckInReservation {
  id: string;
  selected_car: SelectedCar;
  driver: {
    full_name: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface PhotosState {
  [key: string]: string[];
}