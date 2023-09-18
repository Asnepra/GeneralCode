
import mssqlconnect from '@lib/mssqlconnect';
import { NextRequest, NextResponse } from 'next/server';
const sql = require('mssql')

// Connect to the MongoDB database


interface Iparams {
  countryId: string;
}

export const GET = async (req: NextRequest, { params }: { params: Iparams }, res: NextResponse) => {
  try {
    // Connect to the MongoDB database
    await mssqlconnect();
    let documentId = params.countryId;
    documentId = documentId.toString();
    // if(documentId){
    //   console.log("documentId FROM Api \n"+documentId);
    // }
    
    // Fetch the document by its ID from the database
    const result = await sql.query`SELECT * FROM Country_Master WHERE Country_Id = ${documentId}`;
    //console.log(result);
    if (!result || result.recordset.length === 0) {
        return new NextResponse("Country_Id doesn't exist", { status: 404 }); // Return 404 if the document is not found
      }
    

    // Send the JSON response with status code 200
    //console.log("Api get request data \n"+result);
    return new NextResponse(JSON.stringify(result.recordset), { status: 200, headers: { 'Content-Type': 'application/json' } });
   
  } catch (error) {
    console.error('Error fetching most updated document version:', error);
    return new NextResponse("IN Api Calling error internal Error", { status: 500 });
  }
};


export const POST = async (req: Request,{ params }: { params: Iparams }, res: Response) => {
      try {
        // Connect to the MongoDB database
        await mssqlconnect();
        //const fileId = params.countryId; // Extract the file ID from the query parameters
  
        // Implement your specific logic to update the file by ID
        // For example, update the file's content in the database
        const body = await req.json(); // Assuming the updated data is in the request body
        
           const {
            country_name,
            country_flag_location,
            country_map_location,
          } = body;
          const country_updated_by=1;
          const country_added_by=1;
          if(country_name===undefined || country_flag_location ===  undefined || country_map_location === undefined){
            console.log("Incorrect Post Data");
            return new NextResponse("Post Data Incorrect", { status: 400, headers: { 'Content-Type': 'application/json' } });
          }
          console.log(country_name, country_flag_location, country_map_location);
          //post the data into the sql db
          // Execute an INSERT INTO query to add data to the SQL table
          await sql.query`
          INSERT INTO dbo.Country_Master (COUNTRY_NAME, COUNTRY_FLAG_LOCATION, COUNTRY_MAP_LOCATION, COUNTRY_ADDED_BY,COUNTRY_UPDATED_BY)
          VALUES (${country_name}, ${country_flag_location}, ${country_map_location},${country_added_by}, ${country_updated_by});
        `;       
     
  return new NextResponse("Post Data Added Succefully", { status: 200, headers: { 'Content-Type': 'application/json' } });
        
      } catch (error) {
        // Handle errors
        console.log("Api endpoint error" );
        console.error('Error updating file:', error);
      }
    
  };

  
  export const DELETE = async (req: NextRequest, res: NextResponse) => {
    console.log("Delete request by ID");
    // Implement your specific logic to delete a file by ID
  }
  