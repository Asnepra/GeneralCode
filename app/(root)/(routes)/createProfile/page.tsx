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

const Page = () => {
  const params = useSearchParams();
  const selectedCountry = params.get("countrySelected");
  const selectedTemplates = params.get("selectedTemplates");

  const [countryData, setCountryData] = useState({
    country_name: selectedCountry || "",
    flagImageSrc: "",
    mapImageSrc: "",
  });
  const [templateData, setTemplateData] = useState<any[]>([]); // Specify the type as `any[]` or the actual type of your template data

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
      axios
        .get(`http://localhost:3000/api/template_master`)
        .then((response) => {
          console.log("CREATE PROFILE COUNTRY DATA\n", response.data);
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
  console.log("Templates Array: #N" + templatesArray, templatesArray.length);

  // State to hold editor data for each template
  const [editorData, setEditorData] = useState({});

  // Callback to update editor data for a specific template
  const handleEditorDataChange = (index: number, data: string) => {
    setEditorData((prevData) => ({
      ...prevData,
      [index]: data,
    }));
  };

  const handleSubmit = () => {
    // Send the collected editor data to the server or take further action
    console.log("Editor Data:", editorData);
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
                <EditorPage onDataChanged={handleEditorDataChange} />
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
