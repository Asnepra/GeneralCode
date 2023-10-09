import mssqlconnect from "@lib/mssqlconnect";
import { NextRequest, NextResponse } from "next/server";
const sql = require("mssql");
import path from "path";

interface Iparams {
  templateIds: string;
}

export const GET = async (
  req: NextRequest,
  { params }: { params: Iparams },
  res: NextResponse
) => {
  try {
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

    const serverUrl = "http://localhost:3000";
    const flagImageUrl = `${serverUrl}/uploads/countrymaster/flag/${path.basename(
      countryDetails.COUNTRY_FLAG_LOCATION
    )}`;
    const mapImageUrl = `${serverUrl}/uploads/countrymaster/map/${path.basename(
      countryDetails.COUNTRY_MAP_LOCATION
    )}`;

    const countryDataWithImages = {
      ...countryDetails,
      COUNTRY_FLAG_LOCATION: flagImageUrl,
      COUNTRY_MAP_LOCATION: mapImageUrl,
    };

    // Initialize an array to store template names
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
          templateDetails.push({
            TEMPLATE_NAME: templateResult[i].recordset[0].TEMPLATE_NAME,
            TEMPLATE_FILE_DOC_LOCATION:
              templateDataResult.recordset[0]?.TEMPLATE_FILE_DOC_LOCATION ||
              null,
          });
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
    console.log("#n ------ ", templateDetails);

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
