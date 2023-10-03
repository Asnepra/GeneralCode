import React from "react";

import Image from "next/image";

interface CountryDetailsProps {
  data: string;
}
const CountryDetails: React.FC<CountryDetailsProps> = ({ data }) => {
  return (
    <div className="md:hidden">
      <Image
        src="/examples/playground-light.png"
        width={1280}
        height={916}
        alt="Playground"
        className="block dark:hidden"
      />
      <Image
        src="/examples/playground-dark.png"
        width={1280}
        height={916}
        alt="Playground"
        className="hidden dark:block"
      />
    </div>
  );
};

export default CountryDetails;
