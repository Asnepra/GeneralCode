// import prisma from "@/app/libs/prismadb"

// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../pages/api/auth/[...nextauth]";
// import { Session } from "inspector";

// export async function getSession(){
//     return await getServerSession(authOptions);
// }

// export default async function getCurrentUser(){
//     //This is not the api call it is communicating with database on server side
//     try{
//         const session = await getSession();

//         //Check if the current session is correct or not

//         if(!session?.user?.email){
//             return null;
//         }

//         //Find current user
//         const currentUser = await prisma.user.findUnique({
//             where:{
//                 email: session.user.email as string
//             }
//         })

//         //Check if it is the current user
//         if(!currentUser){
//             return null;
//         }

//         return {
//             ...currentUser,
//             createdAt:currentUser.createdAt.toISOString(),
//             updatedAt:currentUser.updatedAt.toISOString(),
//             emailVerified:currentUser.emailVerified?.toISOString() || null,
//         };

//     }catch(error:any){
//         return null;
//     }
// }
