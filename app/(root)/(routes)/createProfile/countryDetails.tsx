"use client";
import React from "react";
import Image from "next/image";

interface CountryDetailsProps {
  data: {
    country_name: string;
    flagImageSrc: string;
    mapImageSrc: string;
  };
}

const CountryDetails = ({ data }: CountryDetailsProps) => {
  const { country_name, flagImageSrc, mapImageSrc } = data || {};

  return (
    <>
      <div className="flex items-center justify-between gap-x-3 mb-8">
        <div className={"w-fit rounded-md"}>
          <Image
            className={"w-28 h-28 rounded-lg object-contain"}
            src={flagImageSrc || "/placeholder.svg"}
            alt="Country Flag Image"
            height={28}
            width={28}
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{country_name}</h2>
        </div>
        <div className={" w-fit rounded-md"}>
          <Image
            className={"w-28 h-28 rounded-lg object-contain"}
            src={mapImageSrc || "/placeholder.svg"}
            alt="Country Map Image"
            height={28}
            width={28}
          />
        </div>
      </div>
    </>
  );
};

export default CountryDetails;
