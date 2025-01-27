
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import axios from "axios";


export async function POST(request: Request) {
    
  // // Get the session
  // const session = await getServerSession(authOptions);

  // // Check if the user is authenticated
  // if (!session || !session?.user) {
  //   return Response.json(
  //     {
  //       success: false,
  //       message: "Not Authenticated",
  //     },
  //     { status: 401 }
  //   );
  // }

   // Get the URL of the request
   const { city, country } = await request.json();

    // Debugging log to check extracted values
    console.log('Extracted city:', city);
    console.log('Extracted country:', country);

  
    if (!city || !country) {
        return Response.json(
          {
            success: false,
            message: "city and country are required",
          },
          { status: 400 }
        );
      }
      try {
      // Call the Geocode API to get latitude and longitude
      const apiKey = process.env.OPEN_WEATHER_KEY; //
      const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;
    const geocodeResponse = await axios.get(geocodeUrl);

    // Extract latitude and longitude from the geocode response
    const { lat, lon } = geocodeResponse.data.coord;

    //Now use the coordinates to get weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherResponse = await axios.get(weatherUrl);

    //Extract relevant weather information
    
    const {
      main: {temp, feels_like, pressure, humidity},
      wind: {speed: windspeed},
      sys: {sunrise, sunset},
    } = weatherResponse.data

    // Convert windspeed from m/s to km/s 
    const windSpeedKmph = (windspeed*3.6).toFixed(2);

    // Convert sunrise and sunset from Unix timestamp to human-readable time
    const sunriseTime = new Date(sunrise*1000).toLocaleTimeString();
    const sunsetTime = new Date(sunset*1000).toLocaleTimeString();


    return Response.json({
      success: true,
      data: {
        temperature: temp,
        feels_like,
        pressure,
        humidity,
        windspeed: `${windSpeedKmph}`,
        sunrise: sunriseTime,
        sunset: sunsetTime,
      },
      message: 'Successfully fetched weather data'
    })
    
  } catch (error) {
    console.error('Error fetching weather Data', error)
    return Response.json({
      success: false,
      message: "Error fetching data from OpenWeather",
    }, {status: 500})
  }
}