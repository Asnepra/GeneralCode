"use client";
// pages/editor.js

// EditorPage.js

import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

type EditorPageProps = {
  onDataChanged: (index: number, data: string) => void;
  index: number;
};
const EditorPage: React.FC<EditorPageProps> = ({ onDataChanged, index }) => {
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (event: any, editor: { getData: () => any }) => {
    const data = editor.getData();
    setEditorContent(data);
    onDataChanged(index, data); // Send the data back to the parent
  };

  return (
    <div className="p-2">
      <CKEditor
        editor={ClassicEditor}
        onChange={handleEditorChange}
        data={editorContent}
      />
    </div>
  );
};

export default EditorPage;
