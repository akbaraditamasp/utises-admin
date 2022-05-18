export default function DashCard({ icon, boxClassName, title, children }) {
  const Icon = icon;
  return (
    <div className="rounded-sm bg-white flex items-center py-3">
      <div
        className={
          "mr-5 rounded-r-md flex items-center justify-center h-16 w-16 " +
          boxClassName
        }
      >
        <Icon size={24} />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xl text-gray-800 font-bold">{children}</span>
        <span className="text-sm">{title}</span>
      </div>
    </div>
  );
}
