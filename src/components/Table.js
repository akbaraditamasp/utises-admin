export const Thead = ({ children }) => (
  <thead className="bg-gray-500 text-white">{children}</thead>
);

export const Tbody = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

export const Th = ({ children }) => <th className="border p-2">{children}</th>;
export const Td = ({ children }) => <td className="border p-2">{children}</td>;

export default function Table({ children, ...props }) {
  return (
    <div className="rounded-sm overflow-auto max-w-full">
      <table className="table-auto min-w-full rounded-lg" {...props}>
        {children}
      </table>
    </div>
  );
}
