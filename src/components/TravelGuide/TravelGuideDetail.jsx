import { Breadcrumb, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { callFetchHandbookDetail } from "config/api";
import { callFetchHandbook } from "config/api";
import { getImage, getUserAvatar } from "utils/imageUrl";
import ReviewHandbook from "./ReviewHandbook";
import { callFetchDetailUserHandbookInteractionByHandbookId } from "config/api";
import { callUpsertUserHandbookInteraction } from "config/api";
import { callFetchCountryDetail } from "config/api";
import { callFetchCityDetail } from "config/api";

export default function TravelGuideDetail() {
    const params = useParams();
    const { countryId, cityId, travelId } = params;
    const [country, setCountry] = useState({});
    const [city, setCity] = useState({});
    const [handbookDetail, setHandbookDetail] = useState({});
    const [relatedArticles, setRelatedArticles] = useState([]);

    const handleGetCountryDetail = async (countryId) => {
        const res = await callFetchCountryDetail(countryId);
        if (res.isSuccess) {
            setCountry(res.data);
        }
    };

    const handleGetCityDetail = async (cityId) => {
        const res = await callFetchCityDetail(cityId);
        if (res.isSuccess) {
            setCity(res.data);
        }
    };

    const handleGetHandbookDetail = async (id) => {
        const res = await callFetchHandbookDetail(id);
        if (res.isSuccess) {
            setHandbookDetail(res.data);
        }
    };

    const handleGetHandbooks = async (query) => {
        const res = await callFetchHandbook(query);
        if (res.isSuccess) {
            setRelatedArticles(res.data);
        }
    };

    const handleUpdateTotalClick = async () => {
        const res = await callFetchDetailUserHandbookInteractionByHandbookId(
            handbookDetail.id
        );
        if (res.isSuccess) {
            const userHandbookInteraction = res.data;
            await callUpsertUserHandbookInteraction({
                handbook_id: handbookDetail.id,
                click_count: userHandbookInteraction.click_count + 1,
                positive_count: userHandbookInteraction.positive_count,
                negative_count: userHandbookInteraction.negative_count,
                neutral_count: userHandbookInteraction.neutral_count,
            });
        } else {
            await callUpsertUserHandbookInteraction({
                handbook_id: handbookDetail.id,
                click_count: 1,
                positive_count: 0,
                negative_count: 0,
                neutral_count: 0,
            });
        }
    };

    useEffect(() => {
        if (travelId && cityId && countryId) {
            window.scrollTo(0, 0);
            handleGetCountryDetail(countryId);
            handleGetCityDetail(cityId);
            handleGetHandbookDetail(travelId);
            handleGetHandbooks(
                `current=1&pageSize=20&city_id=${cityId}&recommended=true`
            );
        }
    }, [travelId, cityId]);

    useEffect(() => {
        if (handbookDetail?.id) {
            handleUpdateTotalClick();
        }
    }, [handbookDetail]);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-gray-50 py-4 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb
                        items={[
                            { title: <Link to="/">Trang chủ</Link> },
                            {
                                title: (
                                    <Link to="/travel-guide">
                                        Cẩm nang du lịch
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link to={`/travel-guide/${country.id}`}>
                                        {country.name}
                                    </Link>
                                ),
                            },
                            {
                                title: (
                                    <Link
                                        to={`/travel-guide/${city?.country?.id}/${city.id}`}
                                    >
                                        {city.name}
                                    </Link>
                                ),
                            },
                            {
                                title: handbookDetail.title,
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
                        <div
                            className="handbook-detail-container"
                            dangerouslySetInnerHTML={{
                                __html: handbookDetail?.description || "",
                            }}
                        ></div>
                        {handbookDetail?.author?.id && (
                            <div class="mt-[88px] border-t border-[#E1E1E1]">
                                <div class="mx-auto w-[154px] h-[154px]">
                                    <img
                                        alt={`${handbookDetail.author.last_name} ${handbookDetail.author.first_name}`}
                                        class="w-full h-full object-cover rounded-full -mt-[88px] border-[22px] border-white border-solid bg-white"
                                        src={getUserAvatar(
                                            handbookDetail.author.avatar
                                        )}
                                    />
                                </div>
                                <h3 class="text-[#161616] text-[22px] font-bold text-center mt-[-18px]">
                                    Tác giả: {handbookDetail.author.last_name}{" "}
                                    {handbookDetail.author.first_name}
                                </h3>
                            </div>
                        )}

                        <div className="mt-[20px]">
                            <ReviewHandbook />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 overflow-hidden">
                            <h3 className="text-xl font-bold mb-4">
                                Bạn cũng có thể thích
                            </h3>
                            <div className="space-y-4 overflow-y-scroll h-[86vh]">
                                {relatedArticles.map((article) => (
                                    <a
                                        key={article.id}
                                        href={`/travel-guide/${article.city.country.id}/${article.city.id}/${article.id}`}
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
                                                        src={getImage(
                                                            article.image
                                                        )}
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
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                article.short_description ||
                                                                "",
                                                        }}
                                                        className="text-xs text-gray-600 line-clamp-2"
                                                    ></div>
                                                </div>
                                            </div>
                                        </Card>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
