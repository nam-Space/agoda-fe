import GoodToKnow from "./GoodToKnow";
import List from "./List";
import Question from "./Question";

const MoreInfo = ({ cityId }) => {
  return (
    <>
      <GoodToKnow cityId={cityId} /> 
      <List cityId={cityId} />
      <Question cityId={cityId} />
    </>
  );
};

export default MoreInfo;
