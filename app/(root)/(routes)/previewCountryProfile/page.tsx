"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import Image from "next/image";
// Import jsPDF
import { Button } from "@components/ui/button";

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

  const pdfref = useRef<HTMLDivElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false); // Add a state for download button visibility

  useEffect(() => {
    // Get URL parameters from the current URL
    const params = new URLSearchParams(window.location.search);
    const countryId = params.get("countryId");
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

  const downloadPDF = () => {
    const urlParam = encodeURIComponent(window.location.href); // Encode the URL

    // Define the base URL of your API endpoint
    const baseUrl = `http://localhost:3000/api/country_profile_pdf/${urlParam}`;

    // Make a GET request to the constructed API URL using Axios
    console.log(`Downloading ${urlParam}`);
    axios
      .get(baseUrl, { responseType: "blob" })
      .then((response) => {
        // Handle the response
        if (response.status === 200) {
          // Create a Blob from the response data
          const blob = new Blob([response.data], { type: "application/pdf" });

          // Create a data URI for the Blob
          const dataUri = URL.createObjectURL(blob);

          // Open the PDF in a new browser tab
          const newTab = window.open(dataUri, "_blank");
          if (newTab) {
            newTab.focus(); // Focus on the new tab
          } else {
            console.error("Failed to open new tab");
          }
        } else {
          console.error("Failed to download PDF:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  // Call the downloadPDF function when needed, e.g., when a button is clicked

  return (
    <div ref={pdfref} className="pl-24 container p-2 max-w-6xl">
      {error ? (
        <div>Error: {error.message}</div>
      ) : countryData ? (
        <div
          id="print-div"
          className="flex items-center justify-between gap-x-3 mb-8"
        >
          <div className={"w-fit rounded-md"}>
            <Image
              className={"w-36 h-36 rounded-lg object-contain"}
              src={
                countryData.countryDataWithImages.COUNTRY_FLAG_LOCATION ||
                "/placeholder.svg"
              }
              alt="Country Flag Image"
              height={100}
              width={100}
              quality={100}
              loading="eager"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {countryData.countryDataWithImages.COUNTRY_NAME}
            </h2>
          </div>
          <div className={"w-fit rounded-md"}>
            <Image
              className={"rounded-lg object-contain"}
              src={
                countryData.countryDataWithImages.COUNTRY_MAP_LOCATION ||
                "/placeholder.svg"
              }
              alt="Country Map Image"
              height={100}
              width={100}
              quality={100}
              loading="eager"
            />
          </div>
          {/* Removed the download button from this section */}
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {/* Display Template File Locations */}
      {countryData && countryData.templateDetails.length > 0 && (
        <div>
          <ul>
            {countryData.templateDetails.map((template, index) => (
              <li key={index}>
                <div className="font-bold p-2">{template.TEMPLATE_NAME}</div>
                <div
                  className="p-2"
                  dangerouslySetInnerHTML={{
                    __html: template.TEMPLATE_FILE_DOC_LOCATION,
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conditionally render the download button */}
      {countryData && !isDownloading && (
        <div className="mt-4 hide-on-print">
          <Button onClick={downloadPDF}>Download PDF</Button>
        </div>
      )}
    </div>
  );
};

export default PreviewCountryProfile;
