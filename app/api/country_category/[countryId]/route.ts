import mssqlconnect from "@lib/mssqlconnect";
import { NextRequest, NextResponse } from "next/server";
const sql = require("mssql");
import path from "path";
import { writeFile, readFile } from "fs/promises";
import { access, constants as fsConstants } from "fs/promises";
import fs from "fs";

// Connect to the MongoDB database

interface Iparams {
  countryId: string;
}

export const GET = async (
  req: NextRequest,
  { params }: { params: Iparams },
  res: NextResponse
) => {
  try {
    // Connect to the MongoDB database
    await mssqlconnect();
    let documentId = params.countryId;
    documentId = documentId.toString();
    if (documentId) {
      console.log("documentId FROM Api \n" + documentId);
    }

    // Fetch the document by its ID from the database
    const result =
      await sql.query`SELECT * FROM Country_Master WHERE Country_Id = ${documentId}`;

    if (!result || result.recordset.length === 0) {
      return new NextResponse("Country_Id doesn't exist", { status: 404 });
    }

    // Get the country details
    const countryDetails = result.recordset[0];
    console.log("Country details\n", countryDetails);

    // Construct image URLs based on your server's URL
    const serverUrl = "http://localhost:3000"; // Replace with your actual server URL
    const flagImageUrl = `${serverUrl}/uploads/countrymaster/flag/${path.basename(
      countryDetails.COUNTRY_FLAG_LOCATION
    )}`;
    const mapImageUrl = `${serverUrl}/uploads/countrymaster/map/${path.basename(
      countryDetails.COUNTRY_MAP_LOCATION
    )}`;

    // Include image URLs in the JSON response
    const countryDataWithImages = {
      ...countryDetails,
      COUNTRY_FLAG_LOCATION: flagImageUrl,
      COUNTRY_MAP_LOCATION: mapImageUrl,
    };

    // Send the JSON response with image URLs
    return new NextResponse(JSON.stringify(countryDataWithImages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching country details:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};

export const POST = async (
  req: Request,
  { params }: { params: Iparams },
  res: Response
) => {
  try {
    // Connect to the MongoDB database
    await mssqlconnect();
    const formData = await req.formData();
    console.log("Form data", formData);
    const countryName = formData.get("country_name");
    const countryFlagImage: File | null = formData.get(
      "country_flag_location"
    ) as unknown as File;
    const countryMapImage: File | null = formData.get(
      "country_map_location"
    ) as unknown as File;
    const file = formData.get("country_flag_location");
    if (!countryFlagImage || !countryMapImage) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }
    //Set Iamge to uploads
    var buffer;
    var flagFileName;
    var mapFileName;
    buffer = Buffer.from(await countryFlagImage.arrayBuffer());
    flagFileName = `flag_${countryName}_${Date.now()}_${countryFlagImage.name.replace(
      / /g,
      "_"
    )}`;
    //console.log(flagFileName);
    try {
      await writeFile(
        path.join(
          process.cwd(),
          "public/uploads/countrymaster/flag/" + flagFileName
        ),
        buffer
      );
    } catch (error) {
      console.log("Error occured saving file on server", error);
      return NextResponse.json({
        Message: "Failed uploading of Flag",
        status: 500,
      });
    }

    buffer = Buffer.from(await countryMapImage.arrayBuffer());
    mapFileName = `map_${countryName}_${Date.now()}_${countryMapImage.name.replace(
      / /g,
      "_"
    )}`;
    //console.log(mapFileName);
    try {
      await writeFile(
        path.join(
          process.cwd(),
          "public/uploads/countrymaster/map/" + mapFileName
        ),
        buffer
      );
    } catch (error) {
      console.log("Error occured saving country map", error);
      return NextResponse.json({
        Message: "Failed in uplaoding Map",
        status: 500,
      });
    }

    // Execute an INSERT INTO query to add data to the SQL table
    // await sql.query`
    //   INSERT INTO dbo.Country_Master (COUNTRY_NAME, COUNTRY_FLAG_LOCATION, COUNTRY_MAP_LOCATION, COUNTRY_ADDED_BY,COUNTRY_UPDATED_BY)
    //   VALUES ('${countryName}', '/uploads/countrymaster/flag/${flagFileName}', '/uploads/countrymaster/map/${mapFileName}', 1, 1)
    // `;
    // Execute an INSERT INTO query to add data to the SQL table
    // Execute an INSERT INTO query to add data to the SQL table
    const flagFileLocation = `/uploads/countrymaster/flag/${flagFileName}`;
    const mapFileLocation = `/uploads/countrymaster/map/${mapFileName}`;
    //console.log("Flag file lcoation ----\n " + flagFileLocation);
    await sql.query`
    INSERT INTO dbo.Country_Master (COUNTRY_NAME, COUNTRY_FLAG_LOCATION, COUNTRY_MAP_LOCATION, COUNTRY_ADDED_BY, COUNTRY_ADDED_ON, COUNTRY_UPDATED_BY,COUNTRY_UPDATED_ON)
    VALUES (${countryName}, ${flagFileLocation}, ${mapFileLocation}, 1, GETDATE(), 1, GETDATE())
    `;

    return new NextResponse("Post Data Added Succefully", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle errors
    console.log("Api endpoint error");
    console.error("Error updating file:", error);
  }
};

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  console.log("Delete request by ID");
  // Implement your specific logic to delete a file by ID
};
