import React from "react";
import axios from "axios";
import { TemplateMasterContent, columns } from "./components/column";
import { DataTable } from "./components/TemplateComponent";

const CreateFile = ({
  countryCategories,
  templateCategories,
}: {
  countryCategories: any;
  templateCategories: any;
}) => {
  return (
    <div className="pl-24 h-full space-y-2 max-w-4xl">
      <DataTable
        columns={columns}
        data={templateCategories}
        countryData={countryCategories}
      />
    </div>
  );
};

export const getStaticProps = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/country_category"
    );
    const responseTemplate = await axios.get(
      "http://localhost:3000/api/template_master"
    );

    const countryCategories = response.data;
    const templateCategories = responseTemplate.data;

    return {
      props: {
        countryCategories,
        templateCategories,
      },
      revalidate: 60, // Re-generate the page every 60 seconds
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        countryCategories: [],
        templateCategories: [],
      },
    };
  }
};

export default CreateFile;
