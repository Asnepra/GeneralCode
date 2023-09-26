import mssqlconnect from "@lib/mssqlconnect";
import { NextRequest, NextResponse } from "next/server";

const sql = require("mssql");

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    // Connect to the MongoDB database
    //await connectMongoDb();
    await mssqlconnect();
    //Fetch all the countries data
    const result =
      await sql.query`SELECT * FROM Template_Master WHERE TEMPLATE_IS_ACTIVE = 1 ORDER BY TEMPLATE_NAME ASC`;

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
