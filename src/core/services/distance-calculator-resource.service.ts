import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DistanceCalculatorResourceService {

  constructor() { }

  public getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    var result = 0;
    var distance = 0;
    const RADIANS: number = 180 / 3.14159265;
    const METRES_IN_MILE: number = 1609.34;

    if (lat1 == lat2 && lng1 == lng2) {

    } else {
      // Calculating Distance between Points
      var lt1 = lat1 / RADIANS;
      var lg1 = lng1 / RADIANS;
      var lt2 = lat2 / RADIANS;
      var lg2 = lng2 / RADIANS;

      // radius of earth in miles (3,958.8) * metres in a mile * position on surface of sphere...
      result = (3958.8 * METRES_IN_MILE) * Math.acos(Math.sin(lt1) * Math.sin(lt2) + Math.cos(lt1) * Math.cos(lt2) * Math.cos(lg2 - lg1));
      distance = result / 1000;
    }

    if(distance > 1){
      return distance.toFixed(0); 
    }else{
      return distance.toFixed(1);
    }


  }

  public async getDistance2(estAddress: any, userAddress: any) {
    const apiKey = "AIzaSyA-MbAFN-OixDQc7dgKLhB3VXYAxKJH5A8"

    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${userAddress}&destinations=${estAddress}&key=${apiKey}`

    try {
      const response = await axios.get(apiUrl)
      const data = response.data

      if (data.status === "OK") {
        const distanceText = data.rows[0].elements[0].distance.text;
        const distanceValue = data.rows[0].elements[0].distance.value;

        console.log(`Road Distance: ${distanceText}`);
        console.log(`Distance Value: ${distanceValue}`);

        if (distanceText > 1) {
          return distanceValue.toFixed(0);
        } else {
          return distanceValue.toFixed(1);
        }
      } else {
        console.log('API Request Failed');
      }
    } catch (error) {
      console.error(error);
    }
  }

  public setRadius(checkPoint: {lat: number, lng: number}, centerPoint: { lat: number; lng: number; }, km: number) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
  }

  public setUserRadius(centerPoint: {lat: number; lng: number}, km: number) {
    
  }
}
