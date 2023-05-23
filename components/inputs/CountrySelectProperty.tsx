'use client';

import useCountrySelectProperty from "@/app/hooks/useCountrySelectProperty";
import Select from "react-select";

export type CountrySelectValue={
    flag: string;
    label:string;
    latlng:number[];
    region:string;
    value:string;
}

interface CategorySelectPropertyInputProps {
  value?: CountrySelectValue,
  onChange: (value: CountrySelectValue ) => void;
}

const CounstrySelectProperty: React.FC<CategorySelectPropertyInputProps> = ({
  value,
  onChange
}) => {

    //using the hooks

    const {getAll} = useCountrySelectProperty();
  return ( 
    <div>
        <Select placeholder="Property Location " isClearable options={getAll()}
        value={value}
        onChange={(value)=>onChange(value as CountrySelectValue)}
        formatOptionLabel={(option:any)=>(
            <div className="flex flex-row items-center gap-3">
                <div >
                    {option.flag}
                </div>
                <div >
                    {option.label},
                    <span className="text-slate-500 ml-1">
                        {option.region}
                    </span>
                </div>
            </div>
        )}
        classNames={{control:()=>'p-1 md:p-2 border-2',
        input :()=>'text-base md:text-lg',
        option :()=>'text-base md:text-lg'}}
        
        theme={(theme)=>({
            ...theme,
            borderRadius:6,
            colors:{
                ...theme.colors,
                primary:'black',
                primary25:'#ffe4e6'
            }
        })} 
    />
    </div>
   );
}
 
export default CounstrySelectProperty;