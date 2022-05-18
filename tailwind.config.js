module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minHeight: {
        12: "3rem",
      },
      colors: {
        primary: {
          base: "#1572A1",
          shade: "#115b81",
          tint: "#d0e3ec",
          background: "#deebf2",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
