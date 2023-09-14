"use client";
import React from "react";

interface CountryFormProps {
  //if the country doesnt exist it returns null
  countryId?: string | null;
  data?: { id: number; COUNTRY_NAME: string }[];
}
const CountryForm = ({ countryId }: CountryFormProps) => {
  return <div>CountryForm</div>;
};

export default CountryForm;
