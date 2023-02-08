export type UserType = {
  email: string;
  password: string;
};

export type PostType = {
  id: number;
  author_id: number;
  title: string;
  category: string;
  description: string;
  is_public: boolean;
  location_name: string;
  street: string;
  state: string;
  city: string;
  zip: string;
  geo: string;
  created_at: Date;
  is_favorite?: boolean;
  favoriteUsers: { id: number }[];
  lat: number;
  lng: number;
  is_blocked: boolean;
};
