"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoriesProps {
  data: { id: number; country_name: string }[];
}

export const Categories = ({ data }: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const countryId = searchParams.get("countryId");

  const onClick = (id: string | undefined) => {
    const query = { countryId: id };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="w-full overflow-x-auto space-x-2 flex p-1">
      <Link href="/country/new">
        <button
          onClick={() => onClick(undefined)}
          className={cn(
            `
          flex 
          items-center 
          text-center 
          text-xs 
          md:text-sm 
          px-2 
          md:px-4 
          py-2 
          md:py-3 
          rounded-md 
          bg-primary/10 
          hover:opacity-75 
          transition
        `,
            !countryId ? "bg-primary/25" : "bg-primary/10"
          )}
        >
          Add/Modify Country
        </button>
      </Link>
      {data.map((item) => (
        <button
          onClick={() => onClick(item.id)}
          className={cn(
            `
            flex 
            items-center 
            text-center 
            text-xs 
            md:text-sm 
            px-2 
            md:px-4 
            py-2 
            md:py-3 
            rounded-md 
            bg-primary/10 
            hover:opacity-75 
            transition
          `,
            item.id === countryId ? "bg-primary/25" : "bg-primary/10"
          )}
          key={item.id}
        >
          {item.country_name}
        </button>
      ))}
    </div>
  );
};
