/* Tailwind нь ЗӨВХӨН utility давхаргыг гаргана (`preflight: false`,
   `tailwind.config.ts`-ийг үз). `site.css` нь хэвээр — энэ нь
   түүнийг орлохгүй, дээр нь нэмэгдэнэ. */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
