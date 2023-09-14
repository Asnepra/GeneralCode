import mssqlconnect from "@lib/mssqlconnect";
import { NextRequest, NextResponse } from "next/server";

const sql = require('mssql')


export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    // Connect to the MongoDB database
    //await connectMongoDb();
    await mssqlconnect();
    //Fetch all the countries data
    const result = await sql.query`SELECT Country_Id AS id, COUNTRY_NAME FROM Country_Master`;
    // Map the result to a JSON format with id and COUNTRY_NAME
    const countryData = result.recordset.map((record: { id: number; COUNTRY_NAME: string; }) => ({
      id: record.id,
      COUNTRY_NAME: record.COUNTRY_NAME
    }));

    //console.log(result);

    return new NextResponse(JSON.stringify(countryData), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    // Handle errors and send an error response with status code 500
    return new NextResponse("IN Api Calling error internal Error", { status: 500 });
  }
};
