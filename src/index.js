import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "leaflet/dist/leaflet.css";
import 'react-loading-skeleton/dist/skeleton.css'
import { Provider } from 'react-redux';
import { store } from './redux/store'
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <CookiesProvider>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </CookiesProvider>
  // </React.StrictMode>
);