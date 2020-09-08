import React from "react";
//import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      multiplier: 2000,
    },
  };
  

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a,b) => {
        if(a.cases>b.cases){
            return -1;
        }else {
            return 1;
        }
    });
    return sortedData;
};

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
          <div className="popup">
            <div className="popup_flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
            <div className="popup_name">{country.country}</div>
            <div className="popup_cases">Cases: {(country.cases)}</div>
            <div className="popup_recovered">Recovered: {(country.recovered)}</div>
            <div className="popup_deaths">Deaths: {(country.deaths)}</div>
          </div>
      </Popup>
      </Circle>
  ));