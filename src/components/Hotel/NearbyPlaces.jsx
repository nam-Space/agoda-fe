import { MapPin } from "lucide-react";

export default function NearbyPlaces({ locations }) {
    console.log("NearbyPlaces locations:", locations); // 🔥 Debug dữ liệu

    if (!locations || locations.length === 0) {
        return <p>Chưa có địa điểm gần đây</p>;
    }

    return (
        <section className="mx-auto bg-white shadow-md rounded-2xl p-6 text-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Đi đâu gần đây
            </h2>
            <ul className="space-y-1 text-sm text-gray-700">
                {locations.map((place, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span>{place}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
