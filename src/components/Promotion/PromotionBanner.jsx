import { Tag as AntTag } from "antd";
import { Calendar, Tag } from "lucide-react";
import {formatDate} from "../../utils/formatDate";

const PromotionBanner = ({
  title,
  description,
  discountPercent,
  startDate,
  endDate,
}) => {
  const discountText = discountPercent 
    ? `Giảm tới ${Number(discountPercent)}%` 
    : "Ưu đãi đặc biệt";

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 shadow-lg">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-4">              
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                {title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/95 max-w-2xl font-medium">
                {description}
              </p>
              
              <div className="inline-flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionBanner;
