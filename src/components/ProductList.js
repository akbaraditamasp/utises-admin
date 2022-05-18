import moment from "moment";
import { FaPen, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import service from "../service";

const MySwal = withReactContent(Swal);

export default function ProductList({
  image,
  title,
  id,
  date,
  afterDelete = () => {},
}) {
  const _delete = () =>
    new Promise((resolve, reject) => {
      service
        .delete("/product/" + id)
        .then(() => {
          afterDelete();
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  const _proceedDelete = () => {
    MySwal.fire({
      title: "Anda Yakin?",
      text: "Anda akan menghapus produk ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batalkan",
    }).then((response) => {
      if (response.isConfirmed) {
        toast.promise(_delete, {
          pending: "Menghapus produk...",
          success: "Produk telah dihapus",
          error: "Produk gagal dihapus",
        });
      }
    });
  };
  return (
    <div className="bg-white mt-5 rounded-sm flex flex-col lg:flex-row p-5 border-2 border-transparent hover:border-gray-300">
      <div className="flex flex-1 items-start">
        <div className="w-20 lg:w-32">
          <div className="w-16-9 rounded-sm overflow-hidden">
            <img src={image} alt={title} />
          </div>
        </div>
        <div className="flex-1 ml-5">
          <div className="text-base lg:text-lg text-gray-700 font-bold line-clamp-1">
            {title}
          </div>
          <div className="text-sm lg:text-base">
            Terakhir dimodifikasi pada {moment(date).format("DD/MM/YYYY")}
          </div>
        </div>
      </div>
      <div className="flex mt-5 lg:mt-0">
        <Link
          to={"/product/" + id}
          className="bg-blue-400 border-2 border-transparent hover:border-blue-500 text-sm h-8 px-2 text-white rounded-sm flex items-center"
        >
          <FaPen className="mr-2" />
          Edit
        </Link>
        <button
          type="button"
          className="bg-red-400 border-2 border-transparent hover:border-red-500 text-sm h-8 px-2 text-white rounded-sm flex items-center ml-2"
          onClick={() => _proceedDelete()}
        >
          <FaTrash className="mr-2" />
          Hapus
        </button>
      </div>
    </div>
  );
}
