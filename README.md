This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Navbar is of around 16 so add mt-16 on the page.tsx

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!



The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## About Avatar.tsx file
Avatar.tsx is outside the navabar as it is going to be used in the app in multiple places,
like for blog posts, for comments and much more.
Hence it is kept outside the navabar completely.

## Added react-icons, react-hook-form, bcrypt, next-auth, axios, zustand
These are the libraries used for the implementation of the backend of the Login and Register functionality. Also,one can use the prisma/mongodb for the backend for login and registration. Set up Toaster Provider before using react-hot-toast

## Added react-hot-toast for the toast messages for debugging and for the user information purposes

## Buttons.tsx, Heading.tsx, Avatar.tsx are available for the full app and are not just for the user sign in and registration
Hence, it has been designed in such a way that they can be used in the full application depedning ont the type of parameters passed


## After adding the Google and Github probiders, 
Do not forgot to add the dependencies for the Google and Github user profiel images.