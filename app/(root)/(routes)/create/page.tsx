"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { TemplateMasterContent, columns } from "./components/column";
import { DataTable } from "./components/TemplateComponent";

const CreateFile = () => {
  const [countryCategories, setCountryCategories] = useState([]);
  const [templateCategories, setTemplateCategories] = useState<
    TemplateMasterContent[]
  >([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        //kindly load the url fomr the env local
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/country_category`
        );
        const responseTemplate = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/template_master`
        );

        setCountryCategories(response.data);
        setTemplateCategories(responseTemplate.data);

        // Data has been fetched, set isLoading to false
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Set isLoading to false in case of an error
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pl-24 h-full space-y-2 max-w-4xl">
      {/* Conditional rendering based on isLoading */}
      {isLoading ? (
        <p>Loading Templates... </p> // Display loading indicator
      ) : (
        <DataTable
          columns={columns}
          data={templateCategories}
          countryData={countryCategories}
        />
      )}
    </div>
  );
};

export default CreateFile;
