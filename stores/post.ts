import { action, makeObservable, observable } from "mobx";

export interface PostParams {
  category: string;
  city: string;
  description: string;
  isPublic: boolean;
  lat: number;
  lng: number;
  locationName?: string;
  state: string;
  title: string;
  zip: string;
}

export class PostStore {
  @observable category: string = "";
  @observable city: string = "";
  @observable description: string = "";
  @observable isPublic: boolean = false;
  @observable lat: number = 0;
  @observable lng: number = 0;
  @observable locationName: string = "";
  @observable state: string = "";
  @observable title: string = "";
  @observable zip: string = "";

  constructor() {
    makeObservable(this);
  }

  @action setCategory(category: string) {
    this.category = category;
  }

  @action setCity(city: string) {
    this.city = city;
  }

  @action setDescription(description: string) {
    this.description = description;
  }

  @action setIsPublic(isPublic: boolean) {
    this.isPublic = isPublic;
  }

  @action setLat(lat: number) {
    this.lat = lat;
  }

  @action setLng(lng: number) {
    this.lng = lng;
  }

  @action setLocationName(locationName: string) {
    this.locationName = locationName;
  }

  @action setState(state: string) {
    this.state = state;
  }

  @action setTitle(title: string) {
    this.title = title;
  }

  @action setZip(zip: string) {
    this.zip = zip;
  }

  @action setPostParams({
    category,
    city,
    description,
    isPublic,
    lat,
    lng,
    locationName = "",
    state,
    title,
    zip,
  }: PostParams) {
    this.category = category;
    this.city = city;
    this.description = description;
    this.isPublic = isPublic;
    this.lat = lat;
    this.lng = lng;
    this.locationName = locationName;
    this.state = state;
    this.title = title;
    this.zip = zip;
  }

  @action clearParams() {
    this.category = "";
    this.city = "";
    this.description = "";
    this.isPublic = false;
    this.lat = 0;
    this.lng = 0;
    this.locationName = "";
    this.state = "";
    this.title = "";
    this.zip = "";
  }
}
