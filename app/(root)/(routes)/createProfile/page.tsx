"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import CountryDetails from "./countryDetails";
import axios from "axios";
import { Textarea } from "@components/ui/textarea";
import EditorPage from "./Editor";
import { Separator } from "@components/ui/separator";
import { Wand2 } from "lucide-react";
import { Button } from "@components/ui/button";

import qs from "query-string";

const Page = () => {
  const params = useSearchParams();
  const selectedCountry = params.get("countrySelected");
  const selectedTemplates = params.get("selectedTemplates");

  const [countryData, setCountryData] = useState({
    country_name: selectedCountry || "",
    country_id: -1,
    flagImageSrc: "",
    mapImageSrc: "",
  });

  const mRouter = useRouter();
  const [templateData, setTemplateData] = useState<any[]>([]); // Specify the type as `any[]` or the actual type of your template data

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`http://localhost:3000/api/country_category/${selectedCountry}`)
        .then((response) => {
          //console.log("CREATE PROFILE COUNTRY DATA\n", response.data);
          // Check if the response contains the expected properties

          // Update the state with the fetched data
          setCountryData({
            country_id: response.data.Country_Id,
            country_name: response.data.COUNTRY_NAME,
            flagImageSrc: response.data.COUNTRY_FLAG_LOCATION,
            mapImageSrc: response.data.COUNTRY_MAP_LOCATION,
          });
          //console.log("COutry data fetched\n", response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      axios
        .get(`http://localhost:3000/api/template_master`)
        .then((response) => {
          //console.log("CREATE PROFILE COUNTRY DATA\n", response.data);
          // Check if the response contains the expected properties
          if (Array.isArray(response.data)) {
            // Update the state with the fetched data
            setTemplateData(response.data);
          } else {
            console.error("Invalid response data:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedCountry]);
  const templatesArray = selectedTemplates
    ? selectedTemplates.split(",").map((templateId) => {
        const template = templateData.find(
          (template) => template.id === parseInt(templateId)
        );
        return template ? template.template_name : "";
      })
    : [];
  //console.log("Templates Array: #N" + templatesArray, templatesArray.length);

  // State to hold editor data for each template
  const [editorData, setEditorData] = useState(
    Array(templatesArray.length).fill("")
  );

  // Callback to update editor data for a specific template
  const handleEditorDataChange = (index: number, data: string) => {
    const newEditorData = [...editorData];
    newEditorData[index] = data;
    setEditorData(newEditorData);
  };

  const handleSubmit = () => {
    // Map the templatesArray to get the actual template IDs based on the index
    const templateIds = templatesArray.map((template, index) => {
      const templateDataItem = templateData.find(
        (templateItem) => templateItem.template_name === template
      );
      return templateDataItem ? templateDataItem.id : null;
    });
    const validTemplateIds = templateIds.filter((id) => id !== null);

    const templateIdsString = validTemplateIds.join(",");

    // Create an array to store the data for each template
    const templateDataArray = validTemplateIds.map((templateId, index) => {
      return {
        templateId,
        editorData: editorData[index], // Editor data for the template
      };
    });

    // Create the postFileData object with the necessary fields
    const postFileData = {
      countryId: countryData.country_id,
      countryName: countryData.country_name,
      templateIds: validTemplateIds, // Use the actual template IDs
      templateData: templateDataArray.map(
        (templateData) => templateData.editorData
      ),
    };

    // Send postFileData to the backend API
    console.log("postFileData:", postFileData);

    axios
      .post(`http://localhost:3000/api/template_details`, postFileData)
      .then((response) => {
        console.log("Added to backend\n");
        // ... (your redirect logic here)
        //send country name as param for the page to display the contents of the file.

        let currentQuery = {};
        if (params) {
          currentQuery = qs.parse(params.toString());
        }

        const updatedQuery = {
          ...currentQuery,
          countryId: countryData.country_id,
          selectedTemplates: templateIdsString, // Join templates into a comma-separated string
        };

        const updatedQueryString = qs.stringify(updatedQuery);
        const url = `/previewCountryProfile?${updatedQueryString}`;
        console.log("url \n", url);
        mRouter.push(url);
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });

    // You can now send postFileData to the backend API using axios or any other HTTP library
  };

  return (
    <div className="pl-24 space-y-2 max-w-5xl justify-between">
      <CountryDetails data={countryData} />
      <Separator className="bg-slate-600" />
      <div className="">
        {templatesArray.map((template, index) => (
          <div key={index} className="space-y-2 mx-auto h-72 ">
            <div className="flex items-center justify-between">
              <div className="w-1/5">{template}</div> {/* 1/4 of the space */}
              <div className="space-x-4 w-4/5">
                {" "}
                {/* 4/5 of the space */}
                <EditorPage
                  index={index}
                  onDataChanged={handleEditorDataChange}
                />
              </div>
            </div>
            <Separator className="bg-slate-600" />
          </div>
        ))}
      </div>
      <div className="m-2 flex justify-end">
        <Button variant="default" onClick={handleSubmit}>
          {" "}
          <Wand2 className="w-4 h-4 mx-2" />
          Create Country Profile
        </Button>{" "}
      </div>
    </div>
  );
};

export default Page;
