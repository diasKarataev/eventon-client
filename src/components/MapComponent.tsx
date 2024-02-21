import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css'; // Подключаем стили Leaflet
import L from 'leaflet'; // Подключаем Leaflet

interface MapProps {
    latitude?: number;
    longitude?: number;
}

const MapComponent: React.FC<MapProps> = ({ latitude, longitude }) => {
    useEffect(() => {
        let map: L.Map | null = null;

        // Проверяем, существует ли уже карта
        const existingMap = document.getElementById('map');
        if (existingMap !== null) {
            // Если карта существует, удаляем её
            existingMap.innerHTML = '';
        }

        // Создаем карту
        map = L.map('map').setView([latitude || 54.98, longitude || 82.89], 13);

        // Добавляем слой OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Если заданы координаты, добавляем маркер с SVG-иконкой
        if (latitude !== undefined && longitude !== undefined) {
            const customIcon = L.icon({
                iconUrl: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" color="green" viewBox="0 0 16 16"><path fill="currentColor" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>',
                iconSize: [32, 32], // Размер иконки
            });
            L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        }

        // Очищаем ресурсы при размонтировании компонента
        return () => {
            if (map !== null) {
                map.remove();
            }
        };
    }, [latitude, longitude]);

    return <div id="map" style={{ width: '500px', height: '400px' }} />;
};

export default MapComponent;
