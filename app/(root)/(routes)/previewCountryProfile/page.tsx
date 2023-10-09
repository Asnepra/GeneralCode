"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import Image from "next/image";
import jspdf from "jspdf";
// Import jsPDF
import html2canvas from "html2canvas";
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
  const generatePDF = () => {
    const doc = new jspdf();
    doc.text("Hello, PDF!", 10, 10);
    doc.save("test.pdf");
  };

  const downloadPDF = () => {
    if (!pdfref.current) return;

    const input = pdfref.current;
    console.log(pdfref.current);
    html2canvas(input).then((canvas) => {
      if (!pdfref.current) return;
      // Determine the text content and font size
      const textContent = pdfref.current.innerText;
      const fontSize = 10; // Adjust the font size as needed

      // Determine the page size based on the text content and font size
      const textWidth = (fontSize * textContent.length) / 2; // Estimate text width
      const pageWidth = textWidth + 20; // Adjust the page width as needed
      const pageHeight = 297; // A4 height in mm

      const pdf = new jspdf("p", "mm", [pageWidth, pageHeight]);

      // Set the font size
      pdf.setFontSize(fontSize);

      // Split the text into multiple lines if it's too wide for the page
      const textLines = pdf.splitTextToSize(textContent, pageWidth - 20); // Adjust margin as needed

      // Add each line to the PDF
      textLines.forEach((line: string | string[], index: number) => {
        pdf.text(line, 10, 10 + index * fontSize);
      });

      pdf.save("demoFile.pdf");
    });
  };

  return (
    <div ref={pdfref} className="pl-24 container p-2">
      {error ? (
        <div>Error: {error.message}</div>
      ) : countryData ? (
        <div className="flex items-center justify-between gap-x-3 mb-8">
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
        <div className="mt-4">
          <Button onClick={downloadPDF}>Download PDF</Button>
        </div>
      )}
    </div>
  );
};

export default PreviewCountryProfile;
