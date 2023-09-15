import Image from "next/image";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (src: string | Blob | null) => void;
  disabled?: boolean;
}

const ImageUpload = ({ onChange, disabled, value }: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [selectedFile, setSelectedFile] = useState<string | Blob | null>(
    value || null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = () => {
    // Trigger the file input dialog
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onChange(URL.createObjectURL(file)); // Pass the URL of the selected file
    }
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
          <Image
            fill
            alt="Upload"
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : "/placeholder.svg"
            }
            className="rounded-lg object-contain"
          />
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
