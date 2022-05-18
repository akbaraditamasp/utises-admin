import { Fragment } from "react";
import { useDropzone } from "react-dropzone";

export default function DropField({ onSelect = () => {}, message, ...props }) {
  const onDrop = (acceptedFiles) => {
    // Do something with the files
    onSelect(acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...props,
  });

  return (
    <Fragment>
      <div
        {...getRootProps()}
        className={`border h-24 flex justify-center items-center ${
          isDragActive ? "border-primary-base" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          Klik atau drop file disini untuk memilih
        </div>
      </div>
      {message && <span className="text-red-700 mt-1 text-sm">{message}</span>}
    </Fragment>
  );
}
