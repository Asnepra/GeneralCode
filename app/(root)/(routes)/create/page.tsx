"use client";
import React, { useEffect, useState } from "react";
import CountrySelect from "./components/CountrySelect";
import axios from "axios";
import { TemplateMasterContent, columns } from "./components/column";
import { DataTable } from "./components/TemplateComponent";
import { Separator } from "@components/ui/separator";

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
        const response = await axios.get(
          "http://localhost:3000/api/country_category"
        );
        const responseTemplate = await axios.get(
          "http://localhost:3000/api/template_master"
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
    <div className="pl-24 h-full space-y-4 max-w-4xl">
      <CountrySelect data={countryCategories} />
      <Separator className="bg-primary/10" />

      {/* Conditional rendering based on isLoading */}
      {isLoading ? (
        <p>Loading Templates... </p> // Display loading indicator
      ) : (
        <DataTable columns={columns} data={templateCategories} />
      )}
    </div>
  );
};

export default CreateFile;
