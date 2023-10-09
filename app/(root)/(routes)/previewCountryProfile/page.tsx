"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

// Define an interface for the API response
interface CountryDataResponse {
  countryDataWithImages: {
    Country_Id: number;
    COUNTRY_NAME: string;
    COUNTRY_FLAG_LOCATION: string;
    COUNTRY_MAP_LOCATION: string;
  };
  templateDetails: {
    TEMPLATE_NAME: string;
    TEMPLATE_FILE_DOC_LOCATION: string;
  }[];
}

const PreviewCountryProfile = () => {
  const [countryData, setCountryData] = useState<CountryDataResponse | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get URL parameters from the current URL
    const params = new URLSearchParams(window.location.search);
    const countryId = params.get("countryId");
    const countrySelected = params.get("countrySelected");
    const selectedTemplates = params.get("selectedTemplates");

    // Combine countryId and selectedTemplates into one string
    const data = `${countryId},${selectedTemplates}`;

    // Construct the API URL with the combined data
    const apiUrl = `http://localhost:3000/api/template_details/${data}`;

    // Make the API request
    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response);
        setCountryData(response.data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <div className="pl-24 container">
      {error ? (
        <div>Error: {error.message}</div>
      ) : countryData ? (
        <div className="flex items-center justify-between gap-x-3 mb-8">
          <div className={"w-fit rounded-md"}>
            <Image
              className={"w-28 h-28 rounded-lg object-contain"}
              src={
                countryData.countryDataWithImages.COUNTRY_FLAG_LOCATION ||
                "/placeholder.svg"
              }
              alt="Country Flag Image"
              height={28}
              width={28}
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {countryData.countryDataWithImages.COUNTRY_NAME}
            </h2>
          </div>
          <div className={" w-fit rounded-md"}>
            <Image
              className={"w-28 h-28 rounded-lg object-contain"}
              src={
                countryData.countryDataWithImages.COUNTRY_MAP_LOCATION ||
                "/placeholder.svg"
              }
              alt="Country Map Image"
              height={28}
              width={28}
            />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {/* Display Template File Locations */}
      {countryData && countryData.templateDetails.length > 0 && (
        <div>
          {" "}
          <ul>
            {countryData.templateDetails.map((template, index) => (
              <li key={index}>
                <div className="font-bold">{template.TEMPLATE_NAME}</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: template.TEMPLATE_FILE_DOC_LOCATION,
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PreviewCountryProfile;
