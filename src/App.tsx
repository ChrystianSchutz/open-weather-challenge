import React, { Component } from 'react'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import axios from 'axios'
import { mode } from './utils'
import './App.css'

type dataTracker = {
  temperatureDay: number,
  temperatureNight: number,
  temperatureMorning: number,
  humidity: number,
}

interface WeatherState {
  cityId: number,
  data: dataTracker[], 
  error?: any
}


export class WeatherForecast extends Component<{}, WeatherState> {
 
  state = { cityId: 524901, data:new Array<dataTracker>(), error: null};

  componentDidMount() {
    const apiId = process.env.REACT_APP_API_ID
    axios.get(`https://openweathermap.org/data/2.5/forecast/daily?id=${this.state.cityId}&appid=${apiId}&cnt=5`)
    .then((response) => {
      this.insert(response.data.list)
    })
    .catch((error) => {
      this.setState({
        error: error
      })
    })
  }

  insert(forecast :any){
    forecast.map((dailyForecast : any) => {
      const day = {
        temperatureDay: dailyForecast.temp.day,
        temperatureNight: dailyForecast.temp.night,
        temperatureMorning: dailyForecast.temp.morn,
        humidity: dailyForecast.humidity
      }
      return this.setState({
        data: this.state.data.concat(day)
      })
    })
  }
  
  showMin(array: number[]){
    return Math.min(...array)
  }

  showMax(array: number[]){
    return Math.max(...array)
  }

  showMean(array: number[]){
    return array.flat().reduce((a, b) => a + b) / array.length
  }
  
  showMode(array: number[]){
    return mode(array.flat())
  }

  render() {
    const temperatures = this.state.data.map((day) => [day.temperatureDay,day.temperatureNight,day.temperatureMorning] ).flat()

    if(this.state.error){
      return(
        <p>
          There was an error when processing this request. Please check if system env REACT_APP_API_ID is declared
        </p>
      )
    }

    if(temperatures.length === 0){
      return(
        <p>Loading...</p>
      )
    }

    return(
      <div className="container">
        <LineChart width={600} height={300} data={this.state.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="temperatureMorning" stroke="#01FF70" name="Morning" />
          <Line type="monotone" dataKey="temperatureDay" stroke="#8884d8" name="Day" />
          <Line type="monotone" dataKey="temperatureNight" stroke="#001f3f"  name="Night" />
        </LineChart>
        <div className={'temperatures'}>
          <h3>Temperatures</h3>
            <p>Min  {this.showMin(temperatures).toFixed(2)} ℃</p>
            <p>Max  {this.showMax(temperatures).toFixed(2)} ℃</p>
            <p>Mean {this.showMean(temperatures).toFixed(2)} ℃</p>
            <p>Mode {this.showMode(temperatures).toFixed(2)} ℃</p>
        </div>
      </div>
    )
  }
}

export default WeatherForecast