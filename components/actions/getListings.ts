import React from 'react'
import prisma from '@/app/libs/prismadb'

export default async function getListings() {
    try{
        //Fetch the listings from here, this is servercomponent, you can call database directly, so no need of api calls
        const listings = await prisma?.listing.findMany({
            orderBy:{
                createdAt:'desc'
            }
        });
        const safeListings = listings.map((item)=>({
            ...item,
            createdAt: item.createdAt.toISOString(),
        }));
        return safeListings;
        
    }catch(error : any){
        throw new Error(error);
    }
}
