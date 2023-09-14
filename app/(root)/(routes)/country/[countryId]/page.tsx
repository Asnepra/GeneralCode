import { Categories } from "@components/Categories";
import { SearchInput } from "@components/search-input";
import axios from "axios";

/**
 *
 * @returns This is a server component that has access to DB
 */
const AddCountryRootPage = async () => {
  //TODO: Check for user loggedin and has permission to add country

  //Check if user likes to modify or add country to the DB
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
  return <div className="h-full p-4 pl-24 space-y-2">Add country</div>;
};
export default AddCountryRootPage;
