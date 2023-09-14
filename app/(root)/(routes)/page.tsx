import { Categories } from "@components/Categories";
import { SearchInput } from "@components/search-input";
import axios from "axios";

/**
 *
 * @returns This is a server component that has access to DB
 */
const RootPage = async () => {
  var countryCategories = [];
  try {
    const response = await axios.get(
      "http://localhost:3000/api/country_category"
    ); // Specify the correct URL with port 3000
    countryCategories = response.data;
    //console.log(countryCategories);
  } catch (e) {
    console.log(e);
  }
  return (
    <div className="h-full p-4 pl-24 space-y-2">
      <SearchInput />
      <Categories data={countryCategories} />
    </div>
  );
};
export default RootPage;