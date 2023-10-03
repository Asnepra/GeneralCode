"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import CountryDetails from "./countryDetails";
import axios from "axios";

const page = () => {
  const params = useSearchParams();
  // Example URL parameters string
  const paramsString = "countrySelected=India&selectedTemplates=1,5";

  // Extract the values of selectedCountry and selectedTemplates
  const selectedCountry = params.get("countrySelected");
  const selectedTemplates = params.get("selectedTemplates");

  console.log("Selected Country:\n", selectedCountry);
  console.log("Selected Templates:\n", selectedTemplates);

  axios.get(`https://localhost/api/country_category/${selectedCountry}`);
  const countryInformation = "";

  return (
    <div className="pl-24">
      <CountryDetails data={countryInformation} />
      {selectedTemplates}
    </div>
  );
};

export default page;
