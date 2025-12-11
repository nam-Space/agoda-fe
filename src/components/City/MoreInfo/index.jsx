import GoodToKnow from "./GoodToKnow";
import List from "./List";
import Question from "./Question";

const MoreInfo = ({ cityId, city }) => {
    return (
        <>
            <GoodToKnow cityId={cityId} city={city} />
            <List cityId={cityId} />
            <Question cityId={cityId} city={city} />
        </>
    );
};

export default MoreInfo;
