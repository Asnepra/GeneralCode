"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Separator } from "@components/ui/separator";
import { Wand2 } from "lucide-react";
import { Button } from "@components/ui/button";

const Page = () => {
  const params = useSearchParams();
  const selectedCountry = params.get("countrySelected");
  const selectedTemplates = params.get("selectedTemplates");
  const [templateIds, setTemplateIds] = useState<number[]>([]);
  const [templateDetails, setTemplateDetails] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCountry && selectedTemplates) {
      // Convert the comma-separated string of selectedTemplates into an array of template IDs
      const templateIdsArray = selectedTemplates.split(",").map(Number);
      setTemplateIds(templateIdsArray);

      // Fetch template details for each templateId
      const fetchTemplateDetails = async () => {
        const detailsPromises = templateIdsArray.map(async (templateId) => {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/template_details/${templateId}`
            );
            return response.data; // Assuming your API response is the template details
          } catch (error) {
            console.error("Error fetching template details:", error);
            return null;
          }
        });

        const details = await Promise.all(detailsPromises);
        setTemplateDetails(details);
      };

      fetchTemplateDetails();
    }
  }, [selectedCountry, selectedTemplates, templateIds]);

  return (
    <div className="pl-24">
      <div>Country: {selectedCountry}</div>
      <div>Selected Templates: {templateIds.join(", ")}</div>
      <div>
        Template Details:
        <ul>
          {templateDetails.map((templateDetail, index) => (
            <li key={index}>{/* Render template detail data here */}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
