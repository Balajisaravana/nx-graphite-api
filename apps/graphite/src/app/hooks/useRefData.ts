import { useEffect, useState } from "react"
import Api from "../api/api-middleware/useApiMethods";
import ApiEndpoints from "../api/ApiEndpoints";
import { RefDataType } from "../api/ApiTypes";
import ApiNames from "../api/ApiNames";
import { useSelector } from "react-redux";
import { get } from "http";
const useRefData = () => {
    const [highCriticality, setHighCriticality] = useState<RefDataType[]>([]);
    const [lowCriticality, setLowCriticality] = useState<RefDataType[]>([]);
    const [mediumCriticality, setMediumCriticality] = useState<RefDataType[]>([]);
    const RefDataApi = Api.get<RefDataType[]>(ApiEndpoints.REF_DATA_URL,ApiNames.REF_DATA);
   
    // console.log("RefDataApi", RefDataApi);
    function categorizeByPriority(tables: RefDataType[]) {
        const high: RefDataType[] = [];
        const medium: RefDataType[] = [];
        const low: RefDataType[] = [];
        for (const table of tables) {
          switch (table.priority) {
            case 'high':
              high.push(table);
              break;
            case 'medium':
              medium.push(table);
              break;
            case 'low':
              low.push(table);
              break;
          }
        }
        setHighCriticality(high);
        setLowCriticality(low);
        setMediumCriticality(medium);
      }
    useEffect(()=>{
        if(RefDataApi.data){
            categorizeByPriority(RefDataApi?.data);
        }
    },[RefDataApi.data])

    return {highCriticality , lowCriticality , mediumCriticality , loading : RefDataApi.loading}
}

export default useRefData