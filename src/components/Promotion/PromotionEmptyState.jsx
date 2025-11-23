import React from "react";
import { Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const PromotionEmptyState = ({ message = "Không có kết quả", onReset }) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
        <InboxOutlined className="text-5xl text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Không có kết quả</h3>
      <p className="text-sm text-gray-500 mb-4">{message}</p>
      {onReset && (
        <div className="flex justify-center gap-2">
          <Button onClick={onReset}>Bỏ lọc</Button>
        </div>
      )}
    </div>
  );
};

export default PromotionEmptyState;
