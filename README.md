# Agoda Frontend (agoda-fe)

## 1. Tổng quan dự án

**Agoda Frontend** là phần giao diện người dùng của hệ thống website du lịch Agoda – một nền tảng mô phỏng hệ sinh thái du lịch – đặt dịch vụ quy mô lớn, lấy cảm hứng từ các hệ thống thực tế như **Agoda, Booking, Traveloka**.

Dự án được xây dựng với mục tiêu:

* Thể hiện khả năng xây dựng **Frontend quy mô lớn** bằng ReactJS
* Xử lý **nhiều nhóm người dùng và phân quyền phức tạp**
* Tích hợp **realtime (WebSocket)** cho chat & thông báo
* Kết nối với **Backend Django + MySQL** theo chuẩn REST API
* Phù hợp để sử dụng làm **portfolio / đồ án / case study**

Frontend không chỉ phục vụ khách hàng đặt dịch vụ mà còn là công cụ vận hành cho nhiều vai trò quản lý khác nhau trong hệ thống du lịch.

---

## 2. Công nghệ & thư viện sử dụng

### 2.1 Công nghệ chính

* **ReactJS**: Xây dựng SPA theo mô hình component-based
* **TailwindCSS**: Thiết kế UI nhanh, responsive, tối ưu cho dự án lớn
* **Redux Toolkit**: Quản lý state toàn cục, dễ scale
* **WebSocket**: Giao tiếp realtime (chat, notification)

### 2.2 Thư viện hỗ trợ

* Axios: Giao tiếp HTTP với Backend
* React Router DOM: Điều hướng & phân quyền route
* JWT Decode: Xử lý token xác thực
* clsx / classnames: Quản lý class CSS
* ESLint & Prettier: Chuẩn hoá code style

---

## 3. Kiến trúc Frontend tổng thể

Frontend được thiết kế theo kiến trúc nhiều lớp rõ ràng:

```
UI Components
   ↓
Pages (Business Screens)
   ↓
Redux Toolkit (Global State)
   ↓
Service Layer (API / WebSocket)
   ↓
Backend (Django REST API)
```

### 3.1 Nguyên tắc thiết kế

* Tách biệt **UI – Logic – State**
* Component tái sử dụng tối đa
* Dễ mở rộng thêm dịch vụ (hotel, flight, event, taxi)
* Dễ mở rộng thêm role người dùng

---

## 4. Hệ thống vai trò người dùng (RBAC)

Hệ thống hỗ trợ **9 nhóm người dùng khác nhau**, mỗi nhóm có giao diện và quyền riêng:

1. **Khách hàng**
2. **Chủ khách sạn**
3. **Nhân viên khách sạn**
4. **Người tổ chức sự kiện**
5. **Tài xế taxi**
6. **Nhân viên vận hành chuyến bay**
7. **Nhân viên bán vé máy bay**
8. **Quản lý marketing**
9. **Admin hệ thống**

Frontend đảm nhiệm:

* Kiểm soát route theo role
* Ẩn/hiện chức năng theo quyền
* Hiển thị layout phù hợp từng nhóm

---

## 5. Chức năng chi tiết cho Khách hàng

### 5.1 Đặt dịch vụ du lịch

Khách hàng có thể:

* Tìm kiếm & đặt **khách sạn**
* Đặt **taxi** theo lộ trình
* Đặt **vé máy bay**
* Đặt **hoạt động du lịch / sự kiện**

### 5.2 Quản lý đơn hàng

* Xem lịch sử đơn đặt
* Theo dõi trạng thái đơn (pending / confirmed / cancelled)
* Hủy đơn theo chính sách

### 5.3 Trải nghiệm người dùng

* Nhận thông báo realtime
* Chat hỗ trợ trực tiếp
* Đọc blog & cẩm nang du lịch

---

## 6. Chức năng cho các vai trò vận hành

### 6.1 Chủ khách sạn / Nhân viên khách sạn

* Quản lý khách sạn & phòng
* Theo dõi lịch đặt phòng
* Thống kê doanh thu theo thời gian

### 6.2 Taxi / Vé máy bay / Sự kiện

* Quản lý chuyến đi / chuyến bay / lịch sự kiện
* Theo dõi thời khóa biểu
* Cập nhật giá & trạng thái

### 6.3 Marketing

* Tạo & quản lý khuyến mãi
* Viết blog & bài cẩm nang
* Theo dõi hiệu quả chiến dịch

### 6.4 Admin hệ thống

* Quản lý toàn bộ user & role
* Giám sát dữ liệu hệ thống
* Thống kê doanh thu tổng

---

## 7. Realtime & WebSocket

Frontend sử dụng WebSocket cho:

* Chat hỗ trợ khách hàng
* Thông báo trạng thái đơn hàng
* Cập nhật dữ liệu tức thì

Redux Toolkit kết hợp WebSocket giúp:

* UI cập nhật realtime
* Giảm tải HTTP polling

---

## 8. Quản lý State với Redux Toolkit

### 8.1 Các slice chính

* authSlice
* userSlice
* bookingSlice
* hotelSlice
* flightSlice
* taxiSlice
* promotionSlice
* notificationSlice

### 8.2 Lợi ích

* State rõ ràng
* Dễ debug
* Phù hợp hệ thống lớn

---

## 9. Cấu trúc thư mục

```
agoda-fe/
├── src/
│   ├── components/      # UI components tái sử dụng
│   ├── pages/           # Màn hình nghiệp vụ
│   ├── layouts/         # Layout theo role
│   ├── redux/           # Store & slices
│   ├── services/        # API & WebSocket
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Helper functions
│   └── assets/          # Images, icons
├── public/
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 10. Cài đặt & chạy dự án

### 10.1 Clone repository

```bash
git clone https://github.com/nam-Space/agoda-fe.git
cd agoda-fe
```

### 10.2 Cài đặt dependencies

```bash
npm install
```

### 10.3 Chạy môi trường development

```bash
npm run dev
```

Truy cập:

```
http://localhost:3000
```

---

## 11. Giao diện
### 11.1 Giao diện trang chủ
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2824f842-39c9-4150-81f4-ee59e4b7734e" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/5893db28-1e16-43fa-8a28-d047edee5b5c" />

### 11.2 Giao diện thành phố
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/a0a1663e-c3fe-49c0-a45f-bbb2d0695b0f" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6775c6d6-d353-45eb-b286-6524767b4dd0" />

### 11.3 Giao diện khách sạn
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/c1d41ef1-7f09-4336-98a5-b2a3420d619f" />
<img width="1916" height="1079" alt="image" src="https://github.com/user-attachments/assets/2126ccd9-1a41-49fa-bf85-c67ca032c7d3" />

### 11.4 Giao diện hoạt động
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/4c337548-2de8-4f4b-bda6-79362ed4fed2" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/5885ca74-68a9-4977-b119-c8a04833d176" />
<img width="1917" height="1076" alt="image" src="https://github.com/user-attachments/assets/099bf4c6-25a5-4d5c-917a-6dee199eb795" />

### 11.5 Giao diện chuyến bay
<img width="1914" height="1075" alt="image" src="https://github.com/user-attachments/assets/0363b94b-56f9-46ed-8cb2-f21d5de361dc" />

### 11.6 Giao diện đặt xe taxi
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/348caae9-fb9d-4c14-970a-2ab613fa0e99" />

### 11.7 Giao diện thanh toán
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/58f21d3b-d6b1-4f09-a497-2a74c85d1251" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0ad75dbe-eb76-40dd-96f6-3d2839ee5b5d" />

### 11.8 Giao diện lịch sử thanh toán cá nhân
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/11025cdf-0da7-4cb8-833c-162b87491e0d" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/3e75cdc7-9f92-4003-8ec5-2cb28c10d127" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0ab57c5b-f220-47f8-83d4-351bd54db6a6" />
<img width="1914" height="1074" alt="image" src="https://github.com/user-attachments/assets/a277fa94-8b19-473e-a450-58de10be5259" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/a297cb35-1067-408a-b7ed-72d6e94c64f2" />


## 12. Kết nối Backend

Frontend giao tiếp với:

* **Django REST API**
* **MySQL Database**
* **WebSocket Server**

File cấu hình môi trường:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

---

## 13. Bảo mật & xác thực

* JWT Authentication
* Route Guard theo role
* Token lưu trữ an toàn

---

## 14. Định hướng phát triển

* Tối ưu SEO
* Lazy loading & code splitting
* Tích hợp payment gateway
* CI/CD & deploy production

---

## 15. Mục đích & giá trị dự án

Dự án giúp:

* Thể hiện kỹ năng React nâng cao
* Hiểu rõ hệ thống đa vai trò
* Kết hợp realtime & state management
* Làm portfolio chuyên nghiệp

---

## 16. Tác giả

**Nam Nguyen**
GitHub: [https://github.com/nam-Space](https://github.com/nam-Space)

---

## 17. License

Project phục vụ mục đích **học tập & portfolio**.
