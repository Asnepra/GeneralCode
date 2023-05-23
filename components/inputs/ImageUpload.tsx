'use client'


import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import React, { useCallback } from 'react'
import { TbPhotoPlus } from 'react-icons/tb';

//Declaring some global variables
declare global{
    var cloudinary:any;
}

//Interface for ImageUpload Props
interface ImageUploadProps{
    onChange:(value:string)=> void;
    value:string;
}
const ImageUpload:React.FC<ImageUploadProps> = ({
    value,
    onChange
}) => {

    //Function for successful upload

    const handleUpload = useCallback((result:any)=>{
        //call onChange and pass the result to
        onChange(result.info.secure_url);
    },[onChange]);
  return (
    <CldUploadWidget onUpload={handleUpload} uploadPreset='cri95fxr' options={{maxFiles:1}}>
        {({open})=>{
            return (
                <div className='relative cursor-pointer hover:opacity-70 tranistion border-dashed border-2 p-20 border-neutral-200 flex flex-col justify-center items-center gap-2 md:gap-4 text-neutral-500' onClick={ ()=>open?.()}>
                    <TbPhotoPlus size={50}/>
                    <div className='font-semibold text-lg'>Click to Upload</div>

                    {/** Conditional Div */}
                    {value &&(
                        <div className='absolute inset-0 h-full w-full'>
                            <Image alt="Uploading..."
                            fill style={{objectFit:'cover'}}
                            src={value}/>

                        </div>
                    )}

                </div>
            )
        }}
    </CldUploadWidget>
  ) 
}

export default ImageUpload