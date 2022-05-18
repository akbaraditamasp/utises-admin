export default function Heading({ children }) {
  return (
    <div className="text-xl font-bold text-gray-800 h-16 flex items-center px-5 lg:px-8 border-b">
      {children}
    </div>
  );
}
