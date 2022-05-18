import { forwardRef } from "react";
import NumberFormat from "react-number-format";

const NumberField = forwardRef(
  ({ className = "", message, label, ...props }, ref) => {
    return (
      <div className={"flex flex-col " + className}>
        {label && <label>{label}</label>}
        <NumberFormat
          ref={ref}
          {...props}
          className={`h-12 bg-white border ${
            message ? "border-red-700" : "border-gray-300"
          } p-2 mt-2 rounded-sm`}
        />
        {message && (
          <span className="text-red-700 mt-1 text-sm">{message}</span>
        )}
      </div>
    );
  }
);

export default NumberField;
