import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs"; // Import the fs module

interface Iparams {
  url: string;
}

const saveAsPdf = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  const result = await page.pdf({
    format: "a4",
  });
  await browser.close();
  //console.log("pdf file", result);

  const filePath = path.join(
    process.cwd(),
    "public/uploads/countrymaster/flag/",
    "downloaded.pdf"
  );

  try {
    await writeFile(filePath, result);
    return filePath; // Return the file path
  } catch (error) {
    console.log("Error occurred saving file on server", error);
    throw error; // Rethrow the error to be caught later
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: Iparams },
  res: NextResponse
) => {
  const url = params.url;
  //console.log("URL FROM THE API", url);

  if (!url) {
    return new NextResponse("Url is missing", {
      status: 500,
    });
  }

  try {
    const filePath = await saveAsPdf(url);

    // Read the file data
    const fileData = await fs.promises.readFile(filePath);

    // Create a NextResponse with the file data and content type
    const response = new NextResponse(fileData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="downloaded.pdf"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};
