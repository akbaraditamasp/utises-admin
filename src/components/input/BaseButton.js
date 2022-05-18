export default function BaseButton({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={
        "rounded-sm h-12 px-12 flex justify-center items-center bg-primary-base text-white ropa text-lg disabled:bg-primary-shade " +
        className
      }
    >
      {children}
    </button>
  );
}
