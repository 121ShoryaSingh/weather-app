
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import axios from "axios";


export async function POST(request: Request) {
    
  // Get the session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  //  Get the URL of the request
   const { latitude, longitude } = await request.json();

  
    if (!longitude|| !latitude) {
        return Response.json(
          {
            success: false,
            message: "Latitude and Longitude are required",
          },
          { status: 400 }
        );
      }
      try {
      // API key
      const apiKey = process.env.OPEN_WEATHER_KEY; //



    //Now use the coordinates to get weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const weatherResponse = await axios.get(weatherUrl);

    //Extract relevant weather information
    
    const {
      weather,
      main: {temp, feels_like, humidity},
      sys: {country},
      name,
    } = weatherResponse.data


    const {main, description, icon} = weather[0]

    //Converting temperature from decimal to an intiger
    const temperature = Math.round(temp);


    
    return Response.json({
      success: true,
      data: {
        main,
        description,
        icon,
        temperature: temperature,
        feels_like,
        humidity,
        country,
        name,
        latitude,
        longitude,
      },
      message: 'Successfully fetched weather data',
      
    })
    
  } catch (error) {
    console.error('Error fetching weather Data', error)
    return Response.json({
      success: false,
      message: "Error fetching data from OpenWeather",
    }, {status: 500})
  }
}