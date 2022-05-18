import { forwardRef } from "react";
import Creatable from "react-select/creatable";

export function parseValue(datas = [], options = []) {
  const value = [];

  for (let data of datas) {
    const getVal = options.find((value) => value.value === data.id);
    value.push(getVal);
  }

  return value;
}

const SelectField = forwardRef(
  ({ className = "", message, label, ...props }, ref) => {
    return (
      <div className={"flex flex-col " + className}>
        {label && <label>{label}</label>}
        <Creatable
          classNamePrefix="react-select"
          ref={ref}
          {...props}
          className={`min-h-12 flex flex-col justify-center bg-white border ${
            message ? "border-red-700" : "border-gray-300"
          } mt-2 rounded-sm`}
        />
        {message && (
          <span className="text-red-700 mt-1 text-sm">{message}</span>
        )}
      </div>
    );
  }
);

export default SelectField;
