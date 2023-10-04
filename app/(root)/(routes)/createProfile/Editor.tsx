"use client";
// pages/editor.js

import React, { useCallback, useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useRouter } from "next/navigation";

interface EditorProps {
  createFile?: boolean;
  userName?: string;
  documentId?: string;
}
const EditorPage: React.FC<EditorProps> = ({
  createFile,
  userName,
  documentId,
}) => {
  // State to hold the current values of the fields
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("1.0");
  const currentDateTime = new Date();
  // Convert the JavaScript Date to a string in ISO format
  const createdAt = currentDateTime.toISOString();

  const [editorContent, setEditorContent] = useState("");

  const handleSubmit = () => {
    const postData = {
      FileId: documentId,
      Title: title,
      VersionNumber: version,
      Data: editorContent,
      CreatedAt: createdAt,
    };

    axios
      .post(`/api/document/${documentId}`, postData)
      .then((response) => {
        //console.log(postData);
        //console.log('Post request successful:', response);
        // Redirect to the home page after a successful post
        const router = useRouter();
        router.push("/");
        // Reset editor content or take appropriate action
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  useEffect(() => {
    // Here, you can log the editor content or send it to the API
    console.log("Editor content:", editorContent);
    // Example: sendToApi(editorContent);
  }, [editorContent]);

  useEffect(() => {
    console.log("Editor data changed: " + editorContent);
  }, [editorContent]);
  const handleEditorChange = (event: any, editor: { getData: () => any }) => {
    const data = editor.getData();
    setEditorContent(data);
    console.log(data); // Update the editor content
  };
  return (
    <>
      <div className="p-2">
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={handleEditorChange}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
    </>
  );
};

export default EditorPage;
