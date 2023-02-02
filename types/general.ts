export type UserType = {
  email: string;
  password: string;
};

export type PostType = {
  id: number;
  title: string;
  is_favorite?: boolean;
  created_at: Date;
  category: string;
  geo: string;
  favoriteUsers: { id: number }[];
  description: string;
  isPublic: boolean;
  lat: number;
  lng: number;
  is_enabled: boolean;
};
