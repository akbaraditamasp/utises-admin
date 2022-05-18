import MiniLoader from "./MiniLoader";

export default function PageLoader() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-gray-500 h-24 px-5 rounded flex flex-col justify-center items-center">
        <MiniLoader />
        <span className="text-white">Sedang Memuat</span>
      </div>
    </div>
  );
}
