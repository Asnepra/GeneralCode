import mssqlconnect from "@lib/mssqlconnect";
import { NextRequest, NextResponse } from "next/server";

const sql = require('mssql')


export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    // Connect to the MongoDB database
    //await connectMongoDb();
    await mssqlconnect();
    //Fetch all the countries data
    const result = await sql.query`SELECT * FROM Country_Master ORDER BY COUNTRY_NAME ASC`;
    // Map the result to a JSON format
    const countryData = result.recordset.map((record: any) => ({
      id: record.Country_Id,
      country_name: record.COUNTRY_NAME,
      country_flag_location: record.COUNTRY_FLAG_LOCATION,
      country_map_location: record.COUNTRY_MAP_LOCATION,
      country_added_by: record.COUNTRY_ADDED_BY,
      COUNTRY_ADDED_ON: record.COUNTRY_ADDED_ON,
      country_updated_by: record.COUNTRY_UPDATED_BY,
      COUNTRY_UPDATED_ON: record.COUNTRY_UPDATED_ON
      // Add more fields as needed
    }));

    //console.log(result);

    return new NextResponse(JSON.stringify(countryData), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    // Handle errors and send an error response with status code 500
    return new NextResponse("IN Api Calling error internal Error", { status: 500 });
  }
};
