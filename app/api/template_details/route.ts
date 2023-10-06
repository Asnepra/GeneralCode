import mssqlconnect from "@lib/mssqlconnect";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const sql = require("mssql");

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    // Connect to the MongoDB database
    //await connectMongoDb();
    await mssqlconnect();
    //Fetch all the countries data
    const result =
      await sql.query`SELECT * FROM Template_Master WHERE TEMPLATE_IS_ACTIVE = 1 ORDER BY TEMPLATE_ID ASC`;

    // Map the result to a JSON format
    const countryData = result.recordset.map((record: any) => ({
      id: record.TEMPLATE_ID,
      template_name: record.TEMPLATE_NAME,
      template_added_by: record.CREATED_BY,
      template_added_on: record.CREATED_ON,
      template_is_active: record.TEMPLATE_IS_ACTIVE,
      // Add more fields as needed
    }));

    //console.log(result);

    return new NextResponse(JSON.stringify(countryData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle errors and send an error response with status code 500
    return new NextResponse("IN Api Calling error internal Error", {
      status: 500,
    });
  }
};

export const POST = async (req: Request, res: Response) => {
  try {
    // Connect to the database (assuming you have the necessary code for this)
    await mssqlconnect();

    const formData = await req.json();
    const { countryId, countryName, templateIds, templateData } = formData;
    console.log("Form data: " + formData);

    for (let i = 0; i < templateIds.length; i++) {
      const docFileName = `doc_file_name_${countryName}_template_data_${countryId}_${Date.now()}_${
        templateIds[i]
      }.html`;
      const filePath = path.join(
        process.cwd(),
        "public/uploads/countrymaster/templateData/",
        docFileName
      );

      try {
        // Write the template data to the file
        await writeFile(filePath, templateData[i], "utf8");
        console.log(
          `File "${docFileName}, and file path is ----${filePath}" created successfully.`
        );

        //update the template details into the db,
        // Update the database with relevant information
        // You should have code here to perform the database update
        await sql.query`
        INSERT INTO dbo.Template_File (
          TEMPLATEFILE_TEMPLATE_ID,
          TEMPLATE_FILE_DOC_ID,
          TEMPLATE_FILE_DOC_LOCATION,
          TEMPLATE_FILE_DOC_DATA_IS_USED,
          TEMPLATEFILE_COUNTRY_ID
      )
      VALUES (
          ${templateIds[i]},              
          ${countryId},
          ${filePath}, 1,${countryId}              
      );
      
        `;

        // Update the database with relevant information
        // You should have code here to perform the database update
      } catch (error) {
        console.error("Error occurred while saving file on the server:", error);
        return NextResponse.json({
          Message: "Failed uploading of template",
          status: 500,
        });
      }
    }

    // You may want to provide a success response
    return NextResponse.json({
      Message: "Templates added successfully",
      status: 200,
    });
  } catch (error) {
    console.error("API endpoint error:", error);
    // Handle errors and provide an appropriate response
    return NextResponse.json({
      Message: "Internal server error",
      status: 500,
    });
  }
};
