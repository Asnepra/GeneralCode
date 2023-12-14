import React, { useState, useEffect } from "react";
import CountryDetails from "./countryDetails";
import axios from "axios";
import { Textarea } from "@components/ui/textarea";
import EditorPage from "./Editor";
import { Separator } from "@components/ui/separator";
import { Wand2 } from "lucide-react";
import { Button } from "@components/ui/button";
import qs from "query-string";
import { useSearchParams } from "next/navigation";

const Page = ({
  countryData,
  templateData,
}: {
  countryData: any;
  templateData: any;
}) => {
  const params = useSearchParams();
  const selectedTemplates = params.get("selectedTemplates");

  const templatesArray = selectedTemplates
    ? selectedTemplates.split(",").map((templateId: string) => {
        const template = templateData.find(
          (template: { id: number }) => template.id === parseInt(templateId)
        );
        return template ? template.template_name : "";
      })
    : [];

  const [editorData, setEditorData] = useState(
    Array(templatesArray.length).fill("")
  );

  const handleEditorDataChange = (index: number, data: string) => {
    const newEditorData = [...editorData];
    newEditorData[index] = data;
    setEditorData(newEditorData);
  };

  const handleSubmit = () => {
    const templateIds = templatesArray.map((template, index) => {
      const templateDataItem = templateData.find(
        (templateItem: { template_name: any }) =>
          templateItem.template_name === template
      );
      return templateDataItem ? templateDataItem.id : null;
    });
    const validTemplateIds = templateIds.filter((id) => id !== null);

    const templateIdsString = validTemplateIds.join(",");

    const templateDataArray = validTemplateIds.map((templateId, index) => {
      return {
        templateId,
        editorData: editorData[index],
      };
    });

    const postFileData = {
      countryId: countryData.country_id,
      countryName: countryData.country_name,
      templateIds: validTemplateIds,
      templateData: templateDataArray.map(
        (templateData) => templateData.editorData
      ),
    };

    console.log("postFileData:", postFileData);

    axios
      .post(`http://localhost:3000/api/template_details`, postFileData)
      .then((response) => {
        console.log("Added to backend\n");

        let currentQuery = {};
        if (params) {
          currentQuery = qs.parse(params.toString());
        }

        const updatedQuery = {
          ...currentQuery,
          countryId: countryData.country_id,
          selectedTemplates: templateIdsString,
        };

        const updatedQueryString = qs.stringify(updatedQuery);
        const url = `/previewCountryProfile?${updatedQueryString}`;
        console.log("url \n", url);
        window.location.href = url; // Redirect using window.location.href
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  return (
    <div className="pl-24 space-y-2 max-w-5xl justify-between">
      <CountryDetails data={countryData} />
      <Separator className="bg-slate-600" />
      <div className="">
        {templatesArray.map((template, index) => (
          <div key={index} className="space-y-2 mx-auto h-72 ">
            <div className="flex items-center justify-between">
              <div className="w-1/5">{template}</div>
              <div className="space-x-4 w-4/5">
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
          <Wand2 className="w-4 h-4 mx-2" />
          Create Country Profile
        </Button>
      </div>
    </div>
  );
};

export const getStaticProps = async ({ params }: { params: any }) => {
  const selectedCountry = params.countrySelected;
  const countryResponse = await axios.get(
    `http://localhost:3000/api/country_category/${selectedCountry}`
  );
  const templateResponse = await axios.get(
    `http://localhost:3000/api/template_master`
  );

  const countryData = {
    country_id: countryResponse.data.Country_Id,
    country_name: countryResponse.data.COUNTRY_NAME,
    flagImageSrc: countryResponse.data.COUNTRY_FLAG_LOCATION,
    mapImageSrc: countryResponse.data.COUNTRY_MAP_LOCATION,
  };

  const templateData = templateResponse.data;

  return {
    props: {
      countryData,
      templateData,
    },
  };
};

export const getServerSideProps = async ({ params }: { params: any }) => {
  const selectedCountry = params.countrySelected;
  const countryResponse = await axios.get(
    `http://localhost:3000/api/country_category/${selectedCountry}`
  );
  const templateResponse = await axios.get(
    `http://localhost:3000/api/template_master`
  );

  const countryData = {
    country_id: countryResponse.data.Country_Id,
    country_name: countryResponse.data.COUNTRY_NAME,
    flagImageSrc: countryResponse.data.COUNTRY_FLAG_LOCATION,
    mapImageSrc: countryResponse.data.COUNTRY_MAP_LOCATION,
  };

  const templateData = templateResponse.data;

  return {
    props: {
      countryData,
      templateData,
    },
  };
};

export default Page;
