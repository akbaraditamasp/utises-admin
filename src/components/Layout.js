import { useState } from "react";
import { useCookies } from "react-cookie";
import { BiBox, BiDollarCircle, BiLogOut, BiTv } from "react-icons/bi";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ReactComponent as Logo } from "../assets/logo.svg";
import service from "../service";

const MySwal = withReactContent(Swal);

function Sidemenu({ icon, children, close = () => {}, active, ...props }) {
  const Icon = icon;
  return (
    <Link
      {...props}
      onClick={() => close()}
      className="flex items-center group hover:bg-primary-background px-5 py-2 relative"
    >
      <span className="w-5 flex justify-center items-center mr-3">
        <Icon size={20} />
      </span>
      <span className="ropa font-bold flex-1">{children}</span>
      {active && (
        <span className="absolute top-0 bottom-0 right-0 w-1 rounded bg-primary-base" />
      )}
    </Link>
  );
}

export default function Layout() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState("dashboard");
  const removeCookie = useCookies()[2];

  const _logout = () =>
    new Promise((resolve, reject) => {
      service
        .delete("/admin/remove-token")
        .then(() => {
          resolve();
          removeCookie("token", { path: "/" });
        })
        .catch(() => {
          reject();
        });
    });
  const _proceedLogout = () => {
    MySwal.fire({
      title: "Anda Yakin?",
      text: "Anda akan keluar dari akun ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batalkan",
    }).then((response) => {
      if (response.isConfirmed) {
        toast.promise(_logout, {
          pending: "Logging out...",
          success: "Berhasil logout",
          error: "Gagal logout",
        });
      }
    });
  };

  const menus = [
    {
      icon: BiTv,
      title: "Dashboard",
      active: "dashboard",
      to: "/",
    },
    {
      icon: BiBox,
      title: "Produk",
      active: "product",
      to: "/product",
    },
    {
      icon: BiDollarCircle,
      title: "Penjualan",
      active: "sales",
      to: "/sales",
    },
  ];
  return (
    <div className="bg-gray-100">
      <div className="z-20 w-full lg:w-1/6 bg-white shadow min-h-0 lg:min-h-screen fixed top-0 left-0 flex flex-col">
        <div className="h-16 border-b-0 lg:border-b flex px-5 items-center">
          <div className="h-8 w-8 bg-primary-base rounded-sm flex items-center justify-center">
            <Logo className="text-white h-4 w-auto" />
          </div>
          <div className="ml-3">
            <div className="text-lg text-gray-800 baloo font-bold -mt-1">
              Utises
            </div>
            <div className="text-xs text-gray-600 -mt-2">Admin Panel</div>
          </div>
          <button
            type="button"
            className="w-8 h-8 border ml-auto flex justify-center items-center lg:hidden rounded-sm"
            onClick={() => setShow(true)}
          >
            <FaBars />
          </button>
        </div>
        <div
          className={`flex flex-col mt-0 lg:mt-5 flex-1 fixed lg:static top-0 left-0 bg-white w-full min-h-screen lg:min-h-0 transform ${
            !show ? "-translate-x-full" : "translate-x-0"
          } transition duration-300 lg:translate-x-0`}
        >
          <div className="flex p-5 border-b mb-5 lg:hidden items-center">
            <div className="text-gray-800 font-bold">MENU</div>
            <button
              type="button"
              className="w-8 h-8 text-red-400 border rounded-full border-red-400 ml-auto flex justify-center items-center lg:hidden"
              onClick={() => setShow(false)}
            >
              <FaTimes />
            </button>
          </div>
          {menus.map((menu, index) => (
            <Sidemenu
              key={`${index}`}
              to={menu.to}
              icon={menu.icon}
              active={active === menu.active}
              close={() => setShow(false)}
            >
              {menu.title}
            </Sidemenu>
          ))}

          <button
            type="button"
            className="mt-auto border-t py-3 px-5 flex text-left items-center"
            onClick={() => _proceedLogout()}
          >
            <BiLogOut
              className="w-5 flex justify-center items-center mr-3"
              size={20}
            />
            <span className="ropa font-bold flex-1">Keluar</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/6 h-16 lg:h-auto"></div>
        <div className="flex-1 min-h-screen">
          <div>
            <Outlet
              context={{
                setActive,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
