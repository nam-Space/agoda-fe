import Footer from 'components/FooterClient';
import Header from 'components/HeaderClient';

import FilterSideBar from 'components/Flight/FilterSideBar';
import FlightList from 'components/Flight/FlightList';
import FlightSortFilter from 'components/Flight/FlightSortFilter';
import FlightDateHeader from 'components/Flight/FligthDateHeader';
import HotelSection from 'components/Flight/HotelSection';
import SearchBarSection from 'components/Flight/SearchBarSection';

const FlightPage = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full bg-white">
        <div className="max-w-[1152px] w-full mx-auto px-3 box-border space-y-6">
          <SearchBarSection />

          <div className="flex gap-6">
            {/* Left */}
            <aside className="w-[320px] shrink-0">
              <FilterSideBar />
            </aside>

            {/* Right */}
            <div className="flex-1 min-w-0 space-y-4">
              <FlightDateHeader />
              <p className="text-sm text-gray-600">
                <span className="block font-semibold text-xl text-black">
                  Chuyến bay từ Hồ Chí Minh đi Nhật Chiếu
                </span>
                Giá trung bình mỗi hành khách
              </p>
              <FlightSortFilter />
              <FlightList />
              <HotelSection />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FlightPage;
