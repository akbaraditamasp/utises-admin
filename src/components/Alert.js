export default function Alert({ className = "", children }) {
  return <div className={"px-5 py-3 " + className}>{children}</div>;
}
