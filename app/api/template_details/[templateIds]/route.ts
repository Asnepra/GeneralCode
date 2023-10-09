import mssqlconnect from "@lib/mssqlconnect";
import { NextRequest, NextResponse } from "next/server";
const sql = require("mssql");
import path from "path";
import fs from "fs/promises";

// Define the API route handler
interface Iparams {
  templateIds: string;
}

export const GET = async (
  req: NextRequest,
  { params }: { params: Iparams },
  res: NextResponse
) => {
  try {
    // Connect to the database
    await mssqlconnect();
    const templateIds = params.templateIds;
    const templateIdsArray = templateIds.split(",");
    const countryId = templateIdsArray[0];
    const templateArray = templateIdsArray.slice(1);

    // Fetch the country details using countryId
    const result = await sql.query`
      SELECT * FROM Country_Master WHERE Country_Id = ${countryId}
    `;

    if (!result || result.recordset.length === 0) {
      return new NextResponse("Country_Id doesn't exist", { status: 404 });
    }

    const countryDetails = result.recordset[0];

    const serverUrl = "http://localhost:3000"; // Use HTTPS
    const flagImageUrl = `${serverUrl}/uploads/countrymaster/flag/${path.basename(
      countryDetails.COUNTRY_FLAG_LOCATION
    )}`;
    const mapImageUrl = `${serverUrl}/uploads/countrymaster/map/${path.basename(
      countryDetails.COUNTRY_MAP_LOCATION
    )}`;

    // Replace backslashes with forward slashes in the file paths
    const flagImageUrlFixed = flagImageUrl.replace(/\\/g, "/");
    const mapImageUrlFixed = mapImageUrl.replace(/\\/g, "/");

    const countryDataWithImages = {
      ...countryDetails,
      COUNTRY_FLAG_LOCATION: flagImageUrlFixed,
      COUNTRY_MAP_LOCATION: mapImageUrlFixed,
    };

    // Initialize an array to store template names and HTML file URLs
    const templateDetails = [];
    const templateResult = [];

    // First, create a list of template IDs from the templateArray
    const templateIdsNumber = templateArray.map(Number);

    // Then, update the TEMPLATE_FILE_DOC_DATA_IS_USED column for records not in templateIds
    await sql.query`
      UPDATE Template_File
      SET TEMPLATE_FILE_DOC_DATA_IS_USED = 0
      WHERE
        TEMPLATEFILE_TEMPLATE_ID NOT IN (${templateIdsNumber})
        AND TEMPLATEFILE_COUNTRY_ID = ${countryId}
    `;

    // Fetch template details for each template
    for (let i = 0; i < templateArray.length; i++) {
      try {
        templateResult[i] = await sql.query`
          SELECT TEMPLATE_NAME FROM Template_Master WHERE TEMPLATE_ID = ${templateArray[i]}
        `;
        const templateDataResult = await sql.query`
          SELECT TEMPLATE_FILE_DOC_LOCATION FROM Template_File WHERE TEMPLATEFILE_TEMPLATE_ID = ${templateArray[i]} and TEMPLATEFILE_COUNTRY_ID=${countryId} and TEMPLATE_FILE_DOC_DATA_IS_USED=1
        `;

        if (templateResult[i].recordset.length > 0) {
          const templateName = templateResult[i].recordset[0].TEMPLATE_NAME;
          const templateFileDocLocation =
            templateDataResult.recordset[0]?.TEMPLATE_FILE_DOC_LOCATION || null;

          // Construct the file path based on countryId and templateId

          try {
            // Read the content of the HTML file
            const htmlContent = await fs.readFile(
              templateFileDocLocation,
              "utf8"
            );

            // Include the HTML content in the response
            templateDetails.push({
              TEMPLATE_NAME: templateName,
              TEMPLATE_FILE_DOC_LOCATION: htmlContent,
            });
          } catch (error) {
            console.error("Error reading HTML file:", error);
          }
        } else {
          console.warn(
            `Template with TEMPLATEFILE_ID ${templateArray[i]} not found.`
          );
        }
      } catch (error) {
        console.error(
          `Error fetching template details for TEMPLATEFILE_ID ${templateArray[i]}:`,
          error
        );
      }
    }

    return new NextResponse(
      JSON.stringify({ countryDataWithImages, templateDetails }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching country details:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};
