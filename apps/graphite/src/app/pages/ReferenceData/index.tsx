import { useState } from "react";
import useRefData from "../../hooks/useRefData";
import GridHandlaer from "../../components/ReferenceItemBox/GridLayout";
import { SALTFlexLayout } from "../../components";
import { useSelector } from "react-redux";
import ApiNames from "../../api/ApiNames";
const ReferenceData = () => {
  const { highCriticality, lowCriticality, mediumCriticality } = useRefData();
  const state = useSelector((state: any) => state);
  console.log("state", state);

  const [active, setActive] = useState(true);
  const handleActiveToggle = () => {
    setActive((current: any) => !current);
  };

  return (
    <SALTFlexLayout margin={2}>
      <GridHandlaer
        active={active}
        handleActiveToggle={handleActiveToggle}
        Label={"High criticality"}
        data={highCriticality}
        rows={10}
        columns={3}
      />
      <GridHandlaer
        active={active}
        handleActiveToggle={handleActiveToggle}
        Label={"Medium criticality"}
        data={mediumCriticality}
        rows={10}
        columns={1}
      />
      <GridHandlaer
        active={active}
        handleActiveToggle={handleActiveToggle}
        Label={"Low criticality"}
        data={lowCriticality}
        rows={10}
        columns={1}
      />
    </SALTFlexLayout>
  );
};

export default ReferenceData;
