import Image from "next/image";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";

interface ImageUploadProps {
  value: File | null; // Change the value prop to accept a single file or null
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUpload = ({ onChange, disabled, value }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = () => {
    // Trigger the file input dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0] || null;

    setSelectedFile(newFile);
    onChange(newFile); // Pass the selected file or null to the parent
  };

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      {/* Use a button to trigger the file input */}

      <div
        onClick={handleFileChange}
        className="
            p-2 
            border-4 
            border-dashed
            border-primary/10 
            rounded-lg 
            hover:opacity-75 
            transition 
            flex 
            flex-col 
            space-y-2 
            items-center 
            justify-center
          "
      >
        <div className="relative h-40 w-40">
          {selectedFile ? (
            // Display the selected image
            <Image
              fill
              alt="Upload"
              src={URL.createObjectURL(selectedFile)}
              className="rounded-lg object-contain"
            />
          ) : (
            // Display a placeholder image
            <Image
              fill
              alt="Upload"
              src="/placeholder.svg"
              className="rounded-lg object-contain"
            />
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  );
};

export default ImageUpload;
