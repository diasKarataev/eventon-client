import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css'; // Подключаем стили Leaflet
import L from 'leaflet'; // Подключаем Leaflet

interface EditMapProps {
    latitude?: number;
    longitude?: number;
    onCoordinatesChange: (latitude: number, longitude: number) => void;
}

const EditMap: React.FC<EditMapProps> = ({ latitude, longitude, onCoordinatesChange }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([latitude || 54.98, longitude || 82.89], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);
        }

        const handleMapClick = (e: L.LeafletMouseEvent) => {
            const clickedLatitude = e.latlng.lat;
            const clickedLongitude = e.latlng.lng;
            onCoordinatesChange(clickedLatitude, clickedLongitude);
            if (markerRef.current) {
                markerRef.current.setLatLng(e.latlng);
            } else {
                // Создаем пользовательскую иконку
                const customIcon = L.icon({
                    iconUrl: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" color="red" viewBox="0 0 16 16"><path fill="currentColor" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>',
                    iconSize: [32, 32],
                });
                // Добавляем маркер с пользовательской иконкой на карту
                markerRef.current = L.marker(e.latlng, { icon: customIcon }).addTo(mapRef.current!);
            }
        };

        // Вызываем функцию handleMapClick с изначальными координатами
        if (latitude !== undefined && longitude !== undefined) {
            const initialLatLng = L.latLng(latitude, longitude);
            handleMapClick({ latlng: initialLatLng } as L.LeafletMouseEvent);
        }

        mapRef.current.on('click', handleMapClick);

        return () => {
            mapRef.current!.off('click', handleMapClick);
        };
    }, [latitude, longitude, onCoordinatesChange]);

    return <div id="map" style={{ width: '500px', height: '400px' }} />;
};

export default EditMap;