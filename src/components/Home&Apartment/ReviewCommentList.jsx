import ReviewItem from 'components/Hotel/ReviewItem';

const ReviewCommentsList = () => {
    const reviews = [
        {
            score: '9,6',
            title: 'Trên cả tuyệt vời',
            country: 'Anh từ Việt Nam',
            userType: 'Du lịch một mình',
            roomType: 'Phòng Tiêu chuẩn giường đôi',
            stayDate: 'Đã ở 1 đêm vào Tháng 5 năm 2025',
            reviewDate: 'Đã nhận xét vào 07 tháng 5 2025',
            comment: 'Sạch sẽ và ấm cúng',
            commentDescription: "Căn phòng rất sạch sẽ và giường rất thoải mái. Tôi ở tầng hai và rất trân trọng khung cảnh mà cửa ra ban công mang lại. Việc thức dậy với âm thanh của người dân Sài Gòn làm việc và trò chuyện là một trải nghiệm tuyệt vời đối với tôi. Nó cũng yên tĩnh vì nằm trong hẻm. Chắc chắn tôi sẽ quay lại đây lần sau.",
            helpful: true,
        },
        {
            score: '10,0',
            title: 'Trên cả tuyệt vời',
            country: 'dat từ Việt Nam',
            userType: 'Cặp đôi',
            roomType: 'Deluxe giường đôi Có ban công',
            stayDate: 'Đã ở 1 đêm vào Tháng 3 năm 2025',
            reviewDate: 'Đã nhận xét vào 31 tháng 3 2025',
            comment: 'Toàn bộ nơi này rất tốt.',
            commentDescription: "Cảm ơn tất cả các bạn đã chăm sóc tôi. Cô ấy luôn trên điện thoại kết nối với tôi và những gì chúng tôi cần. Cô ấy luôn cung cấp. Tôi thật sự trân trọng nỗ lực đó. Phòng của tôi rất sạch sẽ. Nhà bếp và những khu vực xung quanh cũng sạch sẽ, điều này khiến tôi cảm thấy đặc biệt.",
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