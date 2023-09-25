import React from "react";

import CountrySelect from "./components/CountrySelect";
import TemplateComponent from "./components/TemplateComponent";
import axios from "axios";

const CreateFile = async () => {
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
  return (
    <div className="h-full p-4 pl-24 space-y-2">
      <CountrySelect data={countryCategories} />
      <TemplateComponent />
    </div>
  );
};

export default CreateFile;
