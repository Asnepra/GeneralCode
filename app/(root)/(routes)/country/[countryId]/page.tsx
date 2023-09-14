import { Categories } from "@components/Categories";
import { SearchInput } from "@components/search-input";
import axios from "axios";
import CountryForm from "./components/CountryForm";

/**
 *
 * @returns This is a server component that has access to DB
 */

interface AddCountryRootPageProps {
  params: {
    countryId: string;
  };
}
const AddCountryRootPage = async ({ params }: AddCountryRootPageProps) => {
  //TODO: Check for user loggedin and has permission to add country

  //Check if user likes to modify or add country to the DBy
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

  //Since this is going to fetch the country Master data, check if countryId exist or not
  return (
    <div className="h-full p-4 pl-24 space-y-2">
      Add country {params.countryId}
      <CountryForm />
    </div>
  );
};
export default AddCountryRootPage;
