export interface PhotoCategory {
  id: string;
  label: string;
}

export interface CheckInReservation {
  id: string;
  selected_car: {
    name: string;
    [key: string]: any;
  };
  driver: {
    full_name: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface PhotosState {
  [key: string]: string[];
}