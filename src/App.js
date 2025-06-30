
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
import ActivityPage from 'pages/ActivityPage';
import ActivityCityPage from 'pages/ActivityCityPage';

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
          path: "activity/:cityId",
          element:
            <ActivityCityPage />
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
