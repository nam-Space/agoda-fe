
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import HomePage from 'pages/HomePage';
import ProfileHotelPage from 'pages/ProfileHotelPage';
import ProfileFlightPage from 'pages/ProfileFlightPage';
import ProfileActivityPage from 'pages/ProfileActivityPage';
import ProfileChatPage from 'pages/ProfileChatPage';
import ProfilePage from 'pages/ProfilePage';
import FavouritePage from 'pages/FavouritePage';
import FavouriteRoomPage from 'pages/FavouriteRoomPage';
import CartPage from 'pages/CartPage';
import ActivityPage from 'pages/activity/ActivityPage';
import ActivityCityPage from 'pages/activity/ActivityCityPage';
import HotelPage from 'pages/hotel/HotelPage';
import HotelPageBooking from 'pages/hotel/HotelPageBooking';
import BookingVehiclesPage from 'pages/BookingVehiclesPage';
import BookingContactInfomationPage from 'pages/BookingContactInfomationPage';
import ActivityDetailPage from 'pages/activity/ActivityDetailPage';
import CityPage from 'pages/CityPage'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "favourite",
          element:
            <FavouritePage />
        },
        {
          path: "favourite/:hotelId",
          element:
            <FavouriteRoomPage />
        },
        {
          path: "cart",
          element:
            <CartPage />
        },
        {
          path: "activity",
          element:
            <ActivityPage />
        },
        {
          path: "activity/city/:cityId",
          element:
            <ActivityCityPage />
        },
        {
          path: "activity/detail/:activityId",
          element:
            <ActivityDetailPage />
        },
        {
          path: "hotel",
          element:
            <HotelPage /> // Add HotelPage route
        },
        {
          path: "hotel-booking",
          element:
            <HotelPageBooking /> // Add HotelPage route
        },
        {
          path: "city/:cityName",
          element:
            <CityPage /> // Add HotelPage route
        },
        {
          path: "booking-vehicles",
          element:
            <BookingVehiclesPage /> // Add HotelPage route
        },
        {
          path: "booking-contact-information",
          element:
            <BookingContactInfomationPage /> // Add HotelPage route
        },
      ],
    },
    {
      path: "/profile",
      children: [
        {
          path: "hotel",
          element:
            <ProfileHotelPage />
        },
        {
          path: "flight",
          element:
            <ProfileFlightPage />
        },
        {
          path: "activity",
          element:
            <ProfileActivityPage />
        },
        {
          path: "chat",
          element:
            <ProfileChatPage />
        },
        {
          index: true,
          element:
            <ProfilePage />
        },
      ],
    },
  ])

  return (
    <RouterProvider router={router} />
  );
}

export default App;
