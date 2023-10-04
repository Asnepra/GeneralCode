"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import CountryDetails from "./countryDetails";
import axios from "axios";

const Page = () => {
  const params = useSearchParams();
  const selectedCountry = params.get("countrySelected");
  const selectedTemplates = params.get("selectedTemplates");

  const [countryData, setCountryData] = useState({
    country_name: selectedCountry || "",
    flagImageSrc: "",
    mapImageSrc: "",
  });

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`http://localhost:3000/api/country_category/${selectedCountry}`)
        .then((response) => {
          console.log("CREATE PROFILE COUNTRY DATA\n", response.data);
          // Check if the response contains the expected properties
          if (
            response.data &&
            response.data.COUNTRY_NAME &&
            response.data.COUNTRY_FLAG_LOCATION &&
            response.data.COUNTRY_MAP_LOCATION
          ) {
            // Update the state with the fetched data
            setCountryData({
              country_name: response.data.COUNTRY_NAME,
              flagImageSrc: response.data.COUNTRY_FLAG_LOCATION,
              mapImageSrc: response.data.COUNTRY_MAP_LOCATION,
            });
          } else {
            console.error("Invalid response data:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedCountry]);

  return (
    <div className="pl-24">
      <CountryDetails data={countryData} />
      {selectedTemplates}
    </div>
  );
};

export default Page;
