import React from "react";

const InputBox = ({ type, name, Title, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-lx">
        {Title}
      </label>
      <input
        className="w-sm p-2 rounded border border-gray-300 bg-black"
        type={type || "text"}
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputBox;
