import { Posts } from "../models/posts";

export type ErrorApiResponsePayload = {
  message: string;
};

export type CommonApiResponse<T> =
  | { status: "ok"; data: T }
  | { status: "error"; data: ErrorApiResponsePayload };

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
  geo: unknown;
  created_at: Date;
  is_favorite?: boolean;
  favoriteUsers: { id: number }[];
  lat: number;
  lng: number;
  is_blocked: boolean;
};

export type ExchangePostType = Posts & {
  is_favorite?: boolean;
  favoriteUsers: { id: number }[];
};

export type BtnSize = "large" | "small";
export type BtnFontType = "lexend" | "inter" | "roboto";
export type BtnColor = "magenta" | "purple";

export interface ButtonProps {
  color?: BtnColor;
  fontType?: BtnFontType;
  hasIcon?: boolean;
  size?: BtnSize;
}

export interface IOpportunitiesCard {
  description: string;
  icon: string;
  title: string;
  titleWidth: number;
  titleHeight: number;
  url: string;
}

export interface OpportunitiesCardProps {
  item: IOpportunitiesCard;
}

export interface IPrivacyCard {
  description: string;
  icon: string;
  title: string;
  titleWidth: number;
  titleHeight: number;
}

export interface PrivacyCardProps {
  item: IPrivacyCard;
}

export interface ReviewCarouselItem {
  author: string;
  quote: string;
}

export interface CreatePostValues {
  category: string;
  city: string;
  description: string;
  is_public: boolean;
  lat: number;
  lng: number;
  location_name: any;
  state: string;
  title: string;
  zip: string;
}
