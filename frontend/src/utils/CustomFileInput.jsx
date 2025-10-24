import React from "react";

function CustomFileInput({ label, onChange, required }) {
  const fileInputRef = React.useRef();

  return (
    <div className="flex items-center space-x-4">
      <label
        htmlFor={label}
        className="px-4 py-2 rounded border text-white bg-purple-500 border-gray-400  cursor-pointer hover:bg-blue-500 transition"
      >
        Choose file
        <input
          id={label}
          type="file"
          onChange={onChange}
          required={required}
          className="hidden"
          ref={fileInputRef}
        />
      </label>
      <span className="text-sm text-gray-600">
        {/* Show selected filename here (for demo just placeholder) */}
        No file chosen
      </span>
    </div>
  );
}

export default CustomFileInput;
