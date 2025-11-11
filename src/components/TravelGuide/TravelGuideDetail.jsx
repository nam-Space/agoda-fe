import { Breadcrumb, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function TravelGuideDetail() {
    const relatedArticles = [
        {
            id: 1,
            title: "Tìm về thiên nhiên ở Kobe...",
            description:
                "Tính Hyogo, nằm giữa biển và núi, giáp ranh với các thành phố Osaka và Kyoto, sở hữu cảnh quan thiên...",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/serene-mountain-lake-3IZil7VnfV131SNvbtw2jQvdfVzKyI.png",
        },
        {
            id: 2,
            title: "Điểm tham quan phủ hợp...",
            description:
                "Echime là một tỉnh của Nhật Bản nằm dọc theo bộ biên phía tây bắc của đảo Shikoku. Nơi đây duyệt biết đến...",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/hoa-lo-prison-4iFhdTNh0JgLn4zxX3RFvzjlbR6aCM.jpg",
        },
        {
            id: 3,
            title: "Chuyến đi trong ngày từ...",
            description:
                "Fukuoka có thể là thành độ của Kyushu, những chắc chắn nó không phải là thành phố duy nhất đáng ghé thăm...",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/da-nang-adventure-dQlUPTwyq699XTTd3C9xfyXUfA8U3A.jpg",
        },
        {
            id: 4,
            title: "Chuyến đi trong ngày tốt nhất từ Tokyo | 8 địa điểm đề nghị ngoài nhanh chóng bằng tàu cao tốc",
            description:
                "Mang lưỡi tàu cao tốc của Tokyo giúp bạn để đăng thoát khỏi thành phố trong một ngày và khám phá...",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/modern-city-apartment-qwujrPGACEB1T4VmUkPND2Gn6Da293.png",
        },
        {
            id: 5,
            title: "Đi vòng quanh Kyoto [",
            description:
                "Thủ đô của Nhật Bản là Kyoto là một thành phố đầm dã truyền thống và tràn ngập những điều kỳ quặc hú...",
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beach-house-ZBdheWPObKhlb7grX61Biiol1knPdz.jpg",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-gray-50 py-4 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Home</Link> },
                            {
                                title: (
                                    <Link to="/travel-guide">
                                        Cẩm nang du lịch
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link to="/travel-guide-vietnam">
                                        Việt Nam
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link to="/travel-guide-vietnam">
                                        Đà Nẵng
                                    </Link>
                                ),
                            },
                            {
                                title: "10 cuộc phiêu lưu hoành tráng ở Đà Nẵng: Hướng dẫn vui nhộn của người tìm kiếm cảm giác mạnh",
                            },
                        ]}
                        separator={
                            <RightOutlined style={{ fontSize: "12px" }} />
                        }
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        {/* Article Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                            10 cuộc phiêu lưu hoành tráng ở Đà Nẵng: Hướng dẫn
                            vui nhộn của người tìm kiếm cảm giác mạnh
                        </h1>

                        {/* Featured Image */}
                        <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden mb-6">
                            <img
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/serene-mountain-lake-3IZil7VnfV131SNvbtw2jQvdfVzKyI.png"
                                alt="Đà Nẵng Beach"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Last Updated */}
                        <p className="text-gray-600 text-sm mb-6 italic">
                            Last Updated: March 24, 2025
                        </p>

                        {/* Article Section 1 */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Chào mừng bạn đến với Đà Nẵng: Sân chơi
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    phiêu lưu Chào mừng bạn đến với Đà Nẵng, một
                                    thành phố biển tuyệt đẹp ở Việt Nam dạng kêu
                                    gọi tất cả những người đam mê phiêu lưu! Nếu
                                    bạn đang tìm kiếm một lối thoát lý kỳ kết
                                    hợp phong cảnh ngoạn mục với các hoạt động
                                    thốt tim, thì bạn đã đến đúng nơi. Từ những
                                    ngọn núi cao vút đến biển lấp lánh, Đà Nẵng
                                    trăn ngập những cơ hội cho những cuộc phiêu
                                    lưu tìm kiếm cảm giác mạnh.
                                </p>
                                <p>
                                    Điều gì khiến Đà Nẵng trở thành lựa chọn
                                    hàng đầu cho những người yêu thích phiêu
                                    lưu? Đối với người mới bắt đầu, đó là sự pha
                                    trộn hoàn hảo giữa các hoạt động ngoài trời
                                    trôi chảy và thế thao mạo hiểm. Cho dù bạn
                                    là một người đam mê háo hức cuộc sống hay
                                    một người yêu thiền niệm sẵn sàng chính phục
                                    những con đường môn đi bộ đường dài, Đà Nẵng
                                    đều có thứ gì đó để thành phố chỉ làm tăng
                                    thêm sức hấp dẫn khác quả sợn có thể quả sợn
                                    các loại hình khác quả sợn.
                                </p>
                            </div>
                        </div>

                        {/* Article Section 2 */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">
                                Khám phá những cuộc phiêu lưu Đà Nẵng hay nhất
                                dành cho những người nghiện
                            </h2>
                            <div className="text-gray-700 space-y-4">
                                <p>
                                    Dưới đây là danh sách 10 cuộc phiêu lưu
                                    hoành tráng ở Đà Nẵng mà bạn không nên bỏ
                                    lỡ. Từ leo núi đến lặn, từ nhảy dù đến đua
                                    xe địa hình, chúng tôi đã biên soạn một danh
                                    sách toàn diện các hoạt động sẽ để cho trái
                                    tim của bạn đập nhanh.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <h3 className="text-xl font-bold mb-4">
                                Ban cũng có thể thích
                            </h3>
                            <div className="space-y-4">
                                {relatedArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href="#"
                                        className="block"
                                    >
                                        <Card
                                            hoverable
                                            className="overflow-hidden"
                                            bodyStyle={{ padding: "0px" }}
                                        >
                                            <div className="flex gap-3 p-3">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={
                                                            article.image ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={article.title}
                                                        width={80}
                                                        height={80}
                                                        className="w-20 h-20 object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-blue-600">
                                                        {article.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 line-clamp-2">
                                                        {article.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
