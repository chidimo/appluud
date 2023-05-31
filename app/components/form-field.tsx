import { useEffect, useState } from "react";

// app/components/form-field.tsx
interface FormFieldProps {
  htmlFor: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
  error?: string;
}

export function FormField({
  htmlFor,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange = () => {},
  error = "",
}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error);

  useEffect(() => {
    setErrorText(error);
  }, [error]);
  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-xl my-2"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e);
          setErrorText("");
        }}
      />

      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
        {errorText || ""}
      </div>
    </>
  );
}
