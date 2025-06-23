import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { usePlacesStore } from '../store/usePlacesStore';
import PlaceMarker from './PlaceMarker';
import { useEffect } from 'react';

// Кастомный компонент для обновления состояния карты
const MapUpdater = () => {
  const { selectedPlace, places } = usePlacesStore();
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo(selectedPlace.coordinates, 15, {
        animate: true,
        duration: 1.5,
      });
    } else if (places.length > 0) {
      const bounds = new LatLngBounds(places.map(p => p.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedPlace, places, map]);

  return null;
};

// Кастомная иконка для маркеров
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const { places, selectPlace, selectedPlace } = usePlacesStore();
  const defaultCenter: [number, number] = [55.7558, 37.6176];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater />

        {places.map((place) => (
          <PlaceMarker
            key={place.id}
            place={place}
            icon={customIcon}
            isSelected={selectedPlace?.id === place.id}
            onClick={() => selectPlace(place)}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map; 
