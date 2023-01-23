export type UserType = {
  email: string;
  password: string;
};

export type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  event_time: Date;
  category: string;
  geo: string;
  favoriteUsers: { id: number }[];
  description: string;
  isPublic: string;
  lat: number;
  lng: number;
};
