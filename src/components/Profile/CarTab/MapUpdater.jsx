import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapUpdater = ({ center, zoom, bounds, isModalOpen }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !isModalOpen) return;

        // 💥 FIX BUG LEAFLET + MODAL
        setTimeout(() => {
            map.invalidateSize();

            if (bounds && bounds.length === 2) {
                map.fitBounds(bounds, { padding: [40, 40] });
            } else {
                map.setView(center, zoom);
            }
        }, 200);
    }, [center, zoom, bounds, isModalOpen, map]);

    return null;
};

export default MapUpdater;
