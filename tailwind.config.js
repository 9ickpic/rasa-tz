/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Укажи пути к файлам
  ],
  theme: {
    extend: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "1rem",
        lg: "1rem",
        xl: "3.75rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        "ibmplex-regular": ["IBMPlexSans-Regular", "sans-serif"],
        "ibmplex-medium": ["IBMPlexSans-Medium", "sans-serif"],
        "ibmplex-semibold": ["IBMPlexSans-SemiBold", "sans-serif"],
        "inter-semibold": ["Inter-SemiBold", "sans-serif"],
      },
    }, // Расширь стили, если нужно
  },
  plugins: [], // Добавь плагины, если нужно
};
