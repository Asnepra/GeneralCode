"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@components/ui/button";
import html2pdf from "html2pdf.js"; // Import html2pdf.js

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
  const contentRef = useRef<HTMLDivElement | null>(null); // Reference to the content div

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

  // Function to handle PDF download
  const downloadPDF = () => {
    if (typeof window !== "undefined" && contentRef.current) {
      const content = contentRef.current;

      // Define PDF options
      const pdfOptions = {
        margin: 10,
        filename: "country_profile.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Generate PDF
      html2pdf()
        .from(content)
        .set(pdfOptions)
        .outputPdf((pdf: { save: () => void }) => {
          // Trigger download
          pdf.save();
        });
    }
  };

  return (
    <div className="pl-24 container p-2">
      {error ? (
        <div>Error: {error.message}</div>
      ) : countryData ? (
        <div
          ref={contentRef}
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
          <div className="">
            <Button onClick={downloadPDF}>Download PDF</Button>
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
    </div>
  );
};

export default PreviewCountryProfile;
