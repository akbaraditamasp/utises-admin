import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import service from "../service";
import { ReactComponent as Logo } from "../assets/logo.svg";
import BaseButton from "../components/input/BaseButton";
import TextField from "../components/input/TextField";
import MiniLoader from "../components/MiniLoader";
import Alert from "../components/Alert";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const setCookie = useCookies()[1];
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [failed, setFailed] = useState(false);
  const _proceed = ({ username, password }) => {
    setLoading(true);
    service
      .get("/admin/get-token", {
        params: {
          username,
          password,
        },
      })
      .then((response) => {
        setLoading(false);
        setFailed(false);
        setCookie("token", response.data.token, {
          path: "/",
          maxAge: 31104000,
        });
      })
      .catch((e) => {
        setLoading(false);
        setFailed(true);
        console.log(e);
      });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-3/5 bg-primary-base flex justify-start lg:justify-center items-center p-5 px-10">
        <div className="flex items-center">
          <div className="w-12 h-12 lg:w-24 lg:h-24 mr-3 lg:mr-5 border-2 border-white rounded-sm flex justify-center items-center">
            <Logo className="text-white h-6 lg:h-12 w-auto" />
          </div>
          <div>
            <div className="text-2xl lg:text-5xl baloo text-white font-bold">
              Utises
            </div>
            <div className="text-white text-base lg:text-2xl -mt-2">
              Admin Panel
            </div>
          </div>
        </div>
      </div>
      <div className="flex-0 lg:flex-1 p-8 px-10 lg:px-16 flex flex-col justify-center">
        <div className="text-2xl text-gray-800 font-bold">Masuk</div>
        <div>Silahkan masukkan kredensial admin anda</div>
        <form className="mt-12" onSubmit={handleSubmit(_proceed)}>
          {failed && (
            <Alert className="bg-red-400 text-white text-center mb-3">
              Autentikasi gagal
            </Alert>
          )}
          <TextField
            placeholder="Username"
            className="mb-3"
            type="text"
            {...register("username", { required: true })}
          />
          <TextField
            placeholder="Password"
            className="mb-5"
            type="password"
            {...register("password", { required: true })}
          />
          <BaseButton type="submit" disabled={loading}>
            {loading ? <MiniLoader /> : "Masuk"}
          </BaseButton>
        </form>
      </div>
    </div>
  );
}
