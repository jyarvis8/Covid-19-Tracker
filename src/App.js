import React, { useState, useEffect } from 'react';
import './App.css';
import {FormControl, MenuItem, Select, Card, CardContent} from "@material-ui/core";
import {InfoBox1} from './InfoBox.js';
import Map from './Map';
import Table from './Table';
import { sortData } from './util';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng:-40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country) => (
          {
            name: country.country,    //UNITED STATES, UNITED KINGDOM , INDIA
            value: country.countryInfo.iso2     //US, UK, IN
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url=countryCode==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response =>response.json())
    .then(data =>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  };


  return (
    <div className="app">
      <div className='app__left'>
      <div className="app__header">
      <h1>Covid-19 Tracker</h1>
      <FormControl className="app__dropdown">
        <select variant="outlined" onChange={onCountryChange} value={country}>
        <option value="Worldwide" >Worldwide</option>
          {countries.map((country) => (
            <option value={country.value} >{country.name}</option>
          ))}
        </select>
      </FormControl>
      </div>
      <div className="app__stats">
            <InfoBox1 title="Coronavirus Cases" cases={numeral(countryInfo.todayCases).format(0,0)} total={numeral(countryInfo.cases).format(0,0)}/>
            <InfoBox1 title="Recovered" cases={numeral(countryInfo.todayRecovered).format(0,0)} total={numeral(countryInfo.recovered).format(0,0)}/>
            <InfoBox1 title="Deaths" cases={numeral(countryInfo.todayDeaths).format(0,0)} total={numeral(countryInfo.deaths).format(0,0)}/>
      </div>
      <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className='app__right'>
            <CardContent>
              <h3>Live cases by Country</h3>
              <Table countries={tableData}/>
              
            </CardContent>
      </Card>
    </div>
  );
}

export default App;
