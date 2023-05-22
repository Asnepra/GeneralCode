import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId:'',
            clientSecret:'',
        })
    ],
    async session({session}) {
        
    },
    async signIn({profile})  {
        
    }
})

export {handler as GET, handler as POST};

function GoogleProvider(arg0: { clientId: string; clientSecret: string; }): import("next-auth/providers").Provider {
    throw new Error("Function not implemented.");
}
