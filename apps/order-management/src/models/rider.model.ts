export interface Rider {
  id: number;
  name: string;
  is_available: boolean;
  current_latitude: number;
  current_longitude: number;
  created_at: Date;
  updated_at: Date;
}
