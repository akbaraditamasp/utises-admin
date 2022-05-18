import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";
export default function Restrict({ status = "logged", component }) {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [allow, setAllow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let allow = false;
    if (cookies.token && status !== "logged") {
      navigate(location.state?.from?.pathname || "/", {
        replace: true,
      });
    } else if (!cookies.token && status === "logged") {
      navigate("/login", {
        replace: true,
        state: {
          from: location,
        },
      });
    } else {
      allow = true;
    }

    setAllow(allow);
  }, [navigate, cookies.token, status]);

  if (!allow) return null;

  return component;
}
