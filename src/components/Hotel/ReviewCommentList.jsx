import React from 'react';
import ReviewItem from './ReviewItem';

const ReviewCommentsList = () => {
    const reviews = [
        {
            score: '9,6',
            title: 'Trên cả tuyệt vời',
            country: 'Anh từ Việt Nam',
            userType: 'Cặp đôi',
            roomType: 'Căn Hộ 1 Phòng Ngủ',
            stayDate: 'Đã ở 1 đêm vào Tháng 5 năm 2025',
            reviewDate: 'Đã nhận xét vào 07 tháng 5 2025',
            comment: 'View thành phố',
            commentDescription: "Đây là lần thứ ba tôi ở tại Song Apartments và đây là mức giá rẻ nhất tôi đã từng có. Nhưng thật không may, với mức giá rẻ lại đi kèm với những nhược điểm. Một là căn hộ không được sạch sẽ lắm...",
            helpful: true,
        },
        {
            score: '10,0',
            title: 'Trên cả tuyệt vời',
            country: 'dat từ Việt Nam',
            userType: 'Cặp đôi',
            roomType: 'Căn Hộ 2 Phòng Ngủ',
            stayDate: 'Đã ở 1 đêm vào Tháng 3 năm 2025',
            reviewDate: 'Đã nhận xét vào 31 tháng 3 2025',
            comment: 'ok can ho dep',
            commentDescription: "Đây là lần thứ ba tôi ở tại Song Apartments và đây là mức giá rẻ nhất tôi đã từng có. Nhưng thật không may, với mức giá rẻ lại đi kèm với những nhược điểm. Một là căn hộ không được sạch sẽ lắm...",
            helpful: false,
        },
    ];

    return (
        <div className="mt-4">
            {reviews.map((review, index) => (
                <ReviewItem key={index} {...review} />
            ))}
        </div>
    );
};

export default ReviewCommentsList;