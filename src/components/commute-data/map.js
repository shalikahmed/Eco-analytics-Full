import React, { useRef, useState } from 'react';
import trainData from './traindata.js';
import './TrainBetweenStations.css';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';

import { vehicleEmissions, averageSpeeds, trains } from './data';

const center = { lat: 48.8584, lng: 2.2945 };

const practicalDistances = [
  { vehicle: 'Bicycle', maxDistance: 7 },
  { vehicle: 'Motorcycle (Petrol)', maxDistance: 10 },
  { vehicle: 'Car (Petrol)', maxDistance: 500 },
  { vehicle: 'Train', maxDistance: 500 },
  { vehicle: 'Flight', maxDistance: 500000 }, // Maximum distance for flights
];

function formatDistance(distance) {
  if (distance >= 1000) {
    const km = distance / 1000;
    return `${km.toFixed(2)} km`;
  }
  return `${distance} meters`;
}

function formatDuration(duration) {
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days} days ${hours % 24} hours ${minutes} minutes`;
    }
    return `${hours} hours ${minutes} minutes`;
  }
}

function Map() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB4JnT3stxfjIyYFdvbRUhNUbmzBhO41O8',
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [vehicleTimes, setVehicleTimes] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [isRouteCalculated, setIsRouteCalculated] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableTrains, setAvailableTrains] = useState([]);
  const [vehicleWithLeastEmission, setVehicleWithLeastEmission] = useState('');

  const originRef = useRef();
  const destinationRef = useRef();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  function handleVehicleChange(event) {
    const selectedVehicle = event.target.value;
    setSelectedVehicle(selectedVehicle);
    setShowAdditionalFields(false);
  
    const distanceInKm = distance / 1000;
  
    const practicalDistance = practicalDistances.find(
      (item) => item.vehicle === selectedVehicle
    )?.maxDistance;
  
    if (practicalDistance) {
      if (distanceInKm < practicalDistance) {
        setShowAdditionalFields(
          selectedVehicle === 'Bicycle' || selectedVehicle === 'Car (Petrol)'
        );
      } else {
        setShowAdditionalFields(
          selectedVehicle === 'Bicycle' ||
            selectedVehicle === 'Car (Petrol)' ||
            selectedVehicle === 'Train' ||
            selectedVehicle === 'Flight'
        );
      }
    }
  
    const selectedSpeed = averageSpeeds.find(
      (item) => item.vehicle === selectedVehicle
    )?.speed;
  
    if (selectedSpeed) {
      const distanceInKm = distance / 1000;
      const estimatedTime = (distanceInKm / selectedSpeed) * 60; // Convert to minutes
      setDuration(formatDuration(estimatedTime));
    } else {
      setDuration('');
    }
  
    // Calculate estimated times for each vehicle
    const calculatedTimes = averageSpeeds.map((item) => {
      const vehicle = item.vehicle;
      const speed = item.speed;
      const distanceInKm = distance / 1000;
      const estimatedTime = (distanceInKm / speed) * 60; // Convert to minutes
      return { vehicle, time: estimatedTime };
    });
  
    setVehicleTimes(calculatedTimes);
  }
  
  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    const newDistance = results.routes[0].legs[0].distance.value;
    setDistance(newDistance);
    setDuration(results.routes[0].legs[0].duration.value);
    setIsRouteCalculated(true);

    // Calculate estimated times for each vehicle
    const calculatedTimes = averageSpeeds.map((item) => {
      const vehicle = item.vehicle;
      const speed = item.speed;
      const distanceInKm = newDistance / 1000;
      const estimatedTime = (distanceInKm / speed) * 60; // Convert to minutes
      return { vehicle, time: estimatedTime };
    });

    setVehicleTimes(calculatedTimes);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
    setVehicleTimes([]);
    setSelectedVehicle('');
    setIsRouteCalculated(false);
    setShowAdditionalFields(false);
    setStartTime('');
    setEndTime('');
    setAvailableTrains([]);
  }

  function search() {
    const startTimeParts = startTime.split(':');
    const startHour = parseInt(startTimeParts[0]);
    const startMinutes = parseInt(startTimeParts[1]);

    const endTimeParts = endTime.split(':');
    const endHour = parseInt(endTimeParts[0]);
    const endMinutes = parseInt(endTimeParts[1]);

    setAvailableTrains(availableTrains);
  }

  function getTimeTaken() {
    const selectedSpeed = averageSpeeds.find(
      (item) => item.vehicle === selectedVehicle
    )?.speed;
    if (selectedSpeed) {
      const distanceInKm = distance / 1000;
      const timeInMinutes = (distanceInKm / selectedSpeed) * 60;
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = Math.floor(timeInMinutes % 60);
      return `${hours} hours ${minutes} minutes`;
    } else {
      return '';
    }
  }

  function getCarbonEmission() {
    if (selectedVehicle === 'Train') {
      const emissionPerKm = vehicleEmissions.find(
        (item) => item.vehicle === 'Train (Electric)'
      )?.emission;
      if (emissionPerKm) {
        const carbonEmission = ((distance / 1000) * emissionPerKm) / 1000;
        return `${carbonEmission.toFixed(2)} Kg CO2e`;
      }
    } else {
      const emissionPerKm = vehicleEmissions.find(
        (item) => item.vehicle === selectedVehicle
      )?.emission;
      if (emissionPerKm) {
        const carbonEmission = (distance / 1000) * emissionPerKm;
        return `${carbonEmission.toFixed(2)} kg CO2e`;
      }
    }
    return '';
  }

  return (
    <div>
      <div style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ width: '80%', height: '100%' }}>
          <GoogleMap
            center={center}
            zoom={15}
            style={{ width: '100%', height: '100%', borderRadius: '20px' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
      </div>
      <div
        style={{
          padding: '16px',
          borderRadius: '8px',
          margin: '16px',
          backgroundColor: 'white',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          minWidth: '320px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <Autocomplete>
              <input
                type="text"
                placeholder="Origin"
                ref={originRef}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </Autocomplete>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Autocomplete>
              <input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </Autocomplete>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <select
            value={selectedVehicle}
            onChange={handleVehicleChange}
            disabled={!isRouteCalculated}
            style={{ width: '70%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {distance < 7000 ? (
              <>
                <option value="Bicycle">Bicycle</option>
                <option value="Motorcycle (Petrol)">Motorcycle</option>
                <option value="Car (Petrol)">Car</option>
                <option value="Walk">Walk</option>
                {distance >= 12000 && <option value="Train">Train</option>}
              </>
            ) : (
              <>
                <option value="Bicycle">Bicycle</option>
                <option value="Motorcycle (Petrol)">Motorcycle</option>
                <option value="Car (Petrol)">Car</option>
                {distance >= 12000 && <option value="Train">Train</option>}
                {distance >= 500000 && <option value="Flight">Flight</option>}
                <option value="Walk">Walk</option>
              </>
            )}
          </select>
          <div>
            <button
              type="button"
              onClick={calculateRoute}
              disabled={isRouteCalculated}
              style={{ padding: '8px', borderRadius: '4px', marginRight: '8px' }}
            >
              Calculate Route
            </button>
            <button
              type="button"
              onClick={clearRoute}
              disabled={!isRouteCalculated}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              Clear Route
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span>Distance: {formatDistance(distance)}</span>
          <button
            type="button"
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
            style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            <FaLocationArrow />
          </button>
        </div>
        {showAdditionalFields && (
          <div style={{ marginBottom: '16px' }}>
            {selectedVehicle === 'Motorcycle (Petrol)' || selectedVehicle === 'Bicycle' ? (
              <>
                <span style={{ fontWeight: 'bold' }}>Time Taken:</span>
                <span>{getTimeTaken()}</span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 'bold' }}>Time Taken:</span>
                <span>{getTimeTaken()}</span>
              </>
            )}
          </div>
        )}
        {selectedVehicle !== '' && (
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontWeight: 'bold' }}>Time Taken:</span>
            <span>{getTimeTaken()}</span>
            <span style={{ fontWeight: 'bold' }}>Carbon Emission:</span>
            <span>{getCarbonEmission()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;
