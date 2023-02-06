import Geocode from "react-geocode";

export interface Location {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const ApiKey = process.env.GEOCODE;

export interface LocationSearchResult {
  locations: Location[];
}

const getLocations = async (
  searchTerm: string
): Promise<LocationSearchResult | null> => {
  try {
    Geocode.setApiKey(ApiKey);
    Geocode.setRegion("us");
    const response = await Geocode.fromAddress(`${searchTerm}`);
    return { locations: response.results };
  } catch (e) {
    return null;
  }
};

export default getLocations;
