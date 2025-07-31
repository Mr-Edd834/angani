import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState({
    current: {
      temp: 72,
      condition: 'sunny',
      timeOfDay: 'day', // 'sunrise', 'day', 'sunset', 'night'
      time: new Date()
    },
    forecast: [
      { day: 'Mon', high: 75, low: 62, condition: 'sunny' },
      { day: 'Tue', high: 68, low: 58, condition: 'cloudy' },
      { day: 'Wed', high: 72, low: 60, condition: 'partly-cloudy' },
      { day: 'Thu', high: 80, low: 65, condition: 'sunny' },
      { day: 'Fri', high: 65, low: 55, condition: 'rainy' },
      { day: 'Sat', high: 70, low: 60, condition: 'thunderstorm' },
      { day: 'Sun', high: 78, low: 64, condition: 'clear' }
    ]
  });

  const [showActivity, setShowActivity] = useState(null);
  const [showClothing, setShowClothing] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        current: {
          ...prev.current,
          time: new Date()
        }
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle through times of day for demo purposes
  useEffect(() => {
    const times = ['sunrise', 'day', 'sunset', 'night'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % times.length;
      setWeatherData(prev => ({
        ...prev,
        current: {
          ...prev.current,
          timeOfDay: times[index]
        }
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Get background gradient based on time of day
  const getBackground = () => {
    switch (weatherData.current.timeOfDay) {
      case 'sunrise':
        return 'linear-gradient(135deg, #ff7e5f, #feb47b)';
      case 'sunset':
        return 'linear-gradient(135deg, #ff6b6b, #5f27cd)';
      case 'night':
        return 'linear-gradient(135deg, #0f0c29, #302b63)';
      default:
        return 'linear-gradient(135deg, #56ccf2, #2f80ed)';
    }
  };

  // Get activity suggestions based on weather
  const getActivitySuggestion = (condition, temp) => {
    if (condition === 'rainy' || condition === 'thunderstorm') {
      return "Great day for indoor activities: reading, movies, or board games!";
    } else if (temp > 75) {
      return "Perfect for swimming, beach trips, or outdoor sports!";
    } else if (temp > 60) {
      return "Ideal for hiking, picnics, or cycling!";
    } else {
      return "Good weather for a museum visit or coffee shop outing!";
    }
  };

  // Get clothing suggestions based on weather
  const getClothingSuggestion = (condition, temp) => {
    if (condition === 'rainy') {
      return "Waterproof jacket, boots, and an umbrella recommended.";
    } else if (temp > 75) {
      return "Light clothing, sunglasses, and sunscreen needed.";
    } else if (temp > 60) {
      return "Light jacket or sweater may be comfortable.";
    } else {
      return "Warm coat, hat, and gloves recommended.";
    }
  };

  return (
    <AppContainer background={getBackground()}>
      {/* Animated elements */}
      {weatherData.current.timeOfDay === 'day' && <Sun />}
      {weatherData.current.timeOfDay === 'night' && (
        <>
          <Moon />
          {[...Array(20)].map((_, i) => (
            <Star key={i} style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              opacity: Math.random() * 0.5 + 0.5,
              animationDelay: `${Math.random() * 2}s`
            }} />
          ))}
        </>
      )}
      
      {(weatherData.current.condition.includes('cloud') || weatherData.current.condition === 'partly-cloudy') && (
        <>
          <Cloud style={{ top: '15%', left: '10%', animationDuration: '60s' }} />
          <Cloud style={{ top: '25%', left: '60%', animationDuration: '80s' }} />
          <Cloud style={{ top: '10%', left: '40%', animationDuration: '70s' }} />
        </>
      )}
      
      {weatherData.current.condition === 'windy' && <WindEffect />}
      {weatherData.current.condition === 'rainy' && <RainEffect />}
      {weatherData.current.condition === 'thunderstorm' && <ThunderEffect />}

      {/* Clock */}
      <Clock>
        {weatherData.current.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Clock>

      {/* Main content */}
      <WeatherContent>
        <CurrentWeather>
          <h1>{weatherData.current.temp}°</h1>
          <p>{weatherData.current.condition}</p>
        </CurrentWeather>
        
        <ForecastContainer>
          {weatherData.forecast.map((day, index) => (
            <ForecastCard key={index}>
              <h3>{day.day}</h3>
              <p>{day.high}° / {day.low}°</p>
              <WeatherIcon condition={day.condition} />
              
              <ButtonContainer>
                <SuggestionButton 
                  onClick={() => setShowActivity(showActivity === index ? null : index)}
                  active={showActivity === index}
                >
                  Activities
                </SuggestionButton>
                <SuggestionButton 
                  onClick={() => setShowClothing(showClothing === index ? null : index)}
                  active={showClothing === index}
                >
                  Clothing
                </SuggestionButton>
              </ButtonContainer>
              
              {showActivity === index && (
                <SuggestionBox>
                  {getActivitySuggestion(day.condition, day.high)}
                </SuggestionBox>
              )}
              
              {showClothing === index && (
                <SuggestionBox>
                  {getClothingSuggestion(day.condition, day.high)}
                </SuggestionBox>
              )}
            </ForecastCard>
          ))}
        </ForecastContainer>
      </WeatherContent>
    </AppContainer>
  );
};

// Animations
const float = keyframes`
  0% { transform: translateX(-100px); }
  100% { transform: translateX(calc(100vw + 100px)); }
`;

const twinkle = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const rain = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -20% 100%; }
`;

const lightning = keyframes`
  0% { opacity: 0; }
  1% { opacity: 1; }
  2% { opacity: 0; }
  8% { opacity: 0; }
  9% { opacity: 1; }
  10% { opacity: 0; }
  100% { opacity: 0; }
`;

// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.background};
  transition: background 1s ease;
  position: relative;
  overflow: hidden;
`;

const Clock = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 1.5rem;
  color: white;
  z-index: 20;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const WeatherContent = styled.div`
  position: relative;
  z-index: 10;
  padding: 2rem;
  color: white;
`;

const CurrentWeather = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 4rem;
    margin: 0;
  }
  
  p {
    font-size: 1.5rem;
    margin: 0;
    text-transform: capitalize;
  }
`;

const ForecastContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ForecastCard = styled.div`
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 1rem;
  text-align: center;
  flex: 1;
  min-width: 100px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.25);
  }
  
  h3 {
    margin: 0 0 0.5rem;
  }
  
  p {
    margin: 0.5rem 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  gap: 0.5rem;
`;

const SuggestionButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.3rem 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.7rem;
  transition: all 0.2s ease;
  flex: 1;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SuggestionBox = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const WeatherIcon = styled.div`
  height: 40px;
  width: 40px;
  margin: 0.5rem auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${props => {
    switch(props.condition) {
      case 'sunny': return 'url("https://cdn-icons-png.flaticon.com/512/869/869869.png")';
      case 'cloudy': return 'url("https://cdn-icons-png.flaticon.com/512/414/414825.png")';
      case 'partly-cloudy': return 'url("https://cdn-icons-png.flaticon.com/512/1163/1163624.png")';
      case 'rainy': return 'url("https://cdn-icons-png.flaticon.com/512/4151/4151024.png")';
      case 'thunderstorm': return 'url("https://cdn-icons-png.flaticon.com/512/5901/5901843.png")';
      case 'clear': return 'url("https://cdn-icons-png.flaticon.com/512/869/869869.png")';
      default: return 'url("https://cdn-icons-png.flaticon.com/512/414/414825.png")';
    }
  }};
`;

// Animated elements (same as before)
const Sun = styled.div`
  position: absolute;
  top: 20%;
  left: 20%;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #ffff00, #ffcc00);
  border-radius: 50%;
  box-shadow: 0 0 50px #ffcc00;
  animation: ${float} 120s linear infinite;
`;

const Moon = styled.div`
  position: absolute;
  top: 20%;
  right: 20%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, #f5f5f5, #d9d9d9);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(245, 245, 245, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 15px;
    height: 15px;
    background: #0f0c29;
    border-radius: 50%;
  }
`;

const Star = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: ${twinkle} 2s ease-in-out infinite;
`;

const Cloud = styled.div`
  position: absolute;
  width: 150px;
  height: 60px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  animation: ${float} linear infinite;
  animation-duration: ${props => props.animationDuration || '60s'};
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }
  
  &::before {
    width: 50px;
    height: 50px;
    top: -20px;
    left: 20px;
  }
  
  &::after {
    width: 40px;
    height: 40px;
    top: -15px;
    right: 20px;
  }
`;

const WindEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  animation: ${float} 30s linear infinite;
`;

const RainEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20l5 5M30 15l5 5M40 25l5 5M50 20l5 5M60 15l5 5M70 25l5 5M80 20l5 5' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  animation: ${rain} 0.5s linear infinite;
`;

const ThunderEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  opacity: 0;
  animation: ${lightning} 15s infinite;
`;

export default WeatherApp;