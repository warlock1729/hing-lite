"use client";

import { Button } from "@heroui/react";
import JoditEditor from "jodit-react";
import { useRef, useState, useEffect } from "react";

interface DescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function DescriptionEditor({ value:description, onChange }: DescriptionEditorProps) {  const editor = useRef(null);
  const [value, setValue] = useState(description);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(description);
  }, [description]);

  return (
    <div className="mt-2" onClick={() => setIsEditing(true)}>
      <JoditEditor
        ref={editor}
        value={value}
        onBlur={(newValue) => setValue(newValue)}
        config={{
          readonly: !isEditing,
          minHeight: 180,
          placeholder: "Add a description…",

          toolbarAdaptive: false,
          toolbarSticky: false,

          buttons: [
            "bold",
            "italic",
            "underline",
            "|",
            "ul",
            "ol",
            "|",
            "link",
            "|",
            "undo",
            "redo",
          ],

          showCharsCounter: false,
          showWordsCounter: false,
          showXPathInStatusbar: false,
        }}
      />
      {isEditing && (
        <div className="mt-3 flex gap-4 justify-end">
          <Button
            onPress={() => {
              setValue(description);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button onPress={() => {onChange(value);setIsEditing(false)} }color="primary">
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
