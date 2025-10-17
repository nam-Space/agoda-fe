import axios from "axios";
import { useEffect, useState } from "react";

const ExperienceSection = ({ hotelId }) => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!hotelId) return;

        const fetchGuides = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/travel-guides/by-hotel/${hotelId}`
                );
                if (res.data.isSuccess) {
                    setGuides(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, [hotelId]);

    if (loading) return <p>Đang tải trải nghiệm...</p>;

    return (
        <div className="experience-section bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Kinh nghiệm du lịch</h2>
            {guides.length === 0 && <p>Chưa có trải nghiệm nào.</p>}
            {guides.map((guide) => (
                <div key={guide.id} className="mb-4">
                    <h3 className="text-lg font-semibold">{guide.title}</h3>
                    <p className="text-gray-600">{guide.content}</p>
                </div>
            ))}
        </div>
    );
};

export default ExperienceSection;
