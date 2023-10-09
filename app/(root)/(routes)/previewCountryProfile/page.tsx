"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const PreviewCountryProfile = () => {
  const [countryData, setCountryData] = useState(null);
  const [error, setError] = useState(null);

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
    <div className="pl-24">
      {error ? (
        <div>Error: {error.message}</div>
      ) : countryData ? (
        <div>
          <h2>Country Data</h2>
          <p>Country ID: {countryData.countryId}</p>
          <pre>{JSON.stringify(countryData, null, 2)}</pre>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default PreviewCountryProfile;
