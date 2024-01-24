import dynamic from "next/dynamic";
import axios from "axios";
import CountryForm from "./_components/CountryForm";

/**
 * @returns This is a server component that has access to DB
 */

interface AddCountryRootPageProps {
  params: {
    countryId: string;
  };
}

const AddCountryRootPage = async ({ params }: AddCountryRootPageProps) => {
  // TODO: Check for user logged in and has permission to add a country

  // Check if the user likes to modify or add a country to the DB
  const fetchCountryCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/country_category"
      ); // Specify the correct URL with port 3000
      return response.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  // Since this is going to fetch the country Master data, check if countryId exists or not
  const countryCategories = await fetchCountryCategories();

  const CountryFormComponent = dynamic(
    () => import("./_components/CountryForm"),
    { ssr: false }
  );

  return (
    <div className="h-full p-4 pl-24 space-y-2">
      <CountryFormComponent data={countryCategories} />
    </div>
  );
};

export default AddCountryRootPage;
