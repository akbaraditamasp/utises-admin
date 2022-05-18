import { Link } from "react-router-dom";

export default function BaseLink({
  children,
  to = "",
  color = "green",
  ...props
}) {
  let colorCss = "bg-green-700 text-white disabled:bg-green-800";

  return (
    <Link
      to={to}
      className={"rounded-sm px-5 py-2 ropa text-lg " + colorCss}
      {...props}
    >
      {children}
    </Link>
  );
}
