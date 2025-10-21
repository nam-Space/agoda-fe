import { useState } from "react";
import { Rate, Input, Button, Avatar, Empty } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";

export default function ReviewTabView() {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            author: "Nguyễn Văn A",
            rating: 5,
            comment:
                "Khách sạn rất tuyệt vời, phòng sạch sẽ, nhân viên thân thiện. Tôi sẽ quay lại!",
            date: "2025-10-15",
        },
        {
            id: 2,
            author: "Trần Thị B",
            rating: 4,
            comment:
                "Vị trí tốt, gần biển. Nhưng giá hơi cao so với chất lượng.",
            date: "2025-10-10",
        },
        {
            id: 3,
            author: "Lê Minh C",
            rating: 3,
            comment: "Bình thường, không có gì đặc biệt. Phòng hơi nhỏ.",
            date: "2025-10-05",
        },
    ]);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmitReview = () => {
        if (!authorName.trim() || !comment.trim() || rating === 0) {
            alert("Vui lòng điền đầy đủ thông tin và chọn số sao");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newReview = {
                id: reviews.length + 1,
                author: authorName,
                rating,
                comment,
                date: new Date().toISOString().split("T")[0],
            };
            setReviews([newReview, ...reviews]);
            setRating(0);
            setComment("");
            setAuthorName("");
            setLoading(false);
        }, 500);
    };

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)
            : 0;

    return (
        <div className="min-h-screen py-8">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Đánh giá khách sạn
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-600">
                                {averageRating}
                            </span>
                            <div>
                                <Rate
                                    disabled
                                    value={Math.round(Number(averageRating))}
                                />
                                <p className="text-sm text-gray-600">
                                    Dựa trên {reviews.length} đánh giá
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Chia sẻ trải nghiệm của bạn
                    </h2>

                    <div className="space-y-4">
                        {/* Author Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên của bạn{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="Nhập tên của bạn"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                size="large"
                                className="rounded-lg"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đánh giá <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <Rate
                                    value={rating}
                                    onChange={setRating}
                                    size="large"
                                    style={{ fontSize: 32 }}
                                />
                                <span className="text-sm text-gray-600">
                                    {rating > 0 && `${rating} sao`}
                                </span>
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bình luận{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <Input.TextArea
                                placeholder="Chia sẻ trải nghiệm của bạn về khách sạn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                maxLength={500}
                                showCount
                                className="rounded-lg"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                size="large"
                                icon={<SendOutlined />}
                                onClick={handleSubmitReview}
                                loading={loading}
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                            >
                                Gửi đánh giá
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Tất cả đánh giá ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <Empty description="Chưa có đánh giá nào" />
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="border-b border-gray-200 pb-6 last:border-b-0"
                                >
                                    {/* Review Header */}
                                    <div className="flex items-start gap-4 mb-3">
                                        <Avatar
                                            size={40}
                                            icon={<UserOutlined />}
                                            className="bg-blue-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {review.author}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {review.date}
                                                </span>
                                            </div>
                                            <Rate
                                                disabled
                                                value={review.rating}
                                                size="small"
                                            />
                                        </div>
                                    </div>

                                    {/* Review Comment */}
                                    <p className="text-gray-700 leading-relaxed ml-14">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
