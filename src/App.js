
import { Spin } from 'antd';
import ActivityCityPage from 'pages/activity/ActivityCityPage';
import ActivityDetailPage from 'pages/activity/ActivityDetailPage';
import ActivityPage from 'pages/activity/ActivityPage';
import BookingContactInfomationPage from 'pages/BookingContactInfomationPage';
import BookingVehiclesPage from 'pages/BookingVehiclesPage';
import CartPage from 'pages/CartPage';
import CityPage from 'pages/CityPage';
import FavouritePage from 'pages/FavouritePage';
import FavouriteRoomPage from 'pages/FavouriteRoomPage';
import FlightPage from 'pages/flight/FlightPage';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import HomeApartPage from 'pages/home&Apartment/HomeApartPage';
import HomePage from 'pages/HomePage';
import HotelPage from 'pages/hotel/HotelPage';
import HotelPageBooking from 'pages/hotel/HotelPageBooking';
import LoginPage from 'pages/LoginPage';
import ProfileActivityPage from 'pages/ProfileActivityPage';
import ProfileChatPage from 'pages/ProfileChatPage';
import ProfileFlightPage from 'pages/ProfileFlightPage';
import ProfileHotelPage from 'pages/ProfileHotelPage';
import ProfilePage from 'pages/ProfilePage';
import RegisterPage from 'pages/RegisterPage';
import SearchHouseAndApartment from 'pages/SearchHouseAndApartment';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchAccount } from './redux/slice/accountSlide';

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);

  useEffect(() => {
    dispatch(fetchAccount())
  }, [])

  if (isLoading) {
    return <Spin spinning={true} fullscreen />
  }

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "login",
          element:
            <LoginPage />
        },
        {
          path: "register",
          element:
            <RegisterPage />
        },
        {
          path: "forgot-password",
          element:
            <ForgotPasswordPage />
        },
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
            <CityPage />
        },
        {
          path: "flight",
          element:
            <FlightPage /> // Add FlightPage route
        },
        {
          path: "home-apartment",
          element:
            <HomeApartPage />
        },
        {
          path: "search",
          element:
            <SearchHouseAndApartment />
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
