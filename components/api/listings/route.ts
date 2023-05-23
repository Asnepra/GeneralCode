import { NextResponse } from "next/server";


import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(
  request: Request, 
) {
    const currentUser = await getCurrentUser();
    //If there is no current user then return the error
    if (!currentUser){
        return NextResponse.error();
    }
    //Extract the body
    const body = await request.json();
    //extract all the fields from the body
    const{
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price,
    } = body;

    const listings = await prisma.listing.create({
        data:{
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue:location.value,
            price:parseInt(price,10),//parsing in decimal
            userId:currentUser.id

        }
    });

    return NextResponse.json(listings);

}
