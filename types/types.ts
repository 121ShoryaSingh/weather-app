

export interface WeatherData {
        main?: string;
        description?: string;
        icon?: string;
        temperature?: string;
        feels_like?: string;
        pressure?: string;
        humidity?: string;
        windspeed?: string;
        rain?: string;
        all?: string;
        snow?: string;
        sunrise?: string;
        sunset?: string;
        lat?: number;
        lon?: number;
}
export interface User {
    _id?: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    city?: string;
    country?: string;
  }