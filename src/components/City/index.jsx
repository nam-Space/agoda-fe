import Banner from './Banner';
import TopHotel from './TopHotel';
import MoreInfo from './MoreInfo';
import Footer from './Footer';

const City = () => {
    return (
        <div>
            <Banner />
            <div className="m-auto max-w-[1515px]">
                <TopHotel />
                <MoreInfo />
            </div>
            <Footer />
        </div>
    );
};

export default City;
