/* `<html>` нь `app/[locale]/layout.tsx`-д (хэлээр `lang` өөр). Энэ
   файл нь `app/not-found.tsx`-д root layout шаардагддаг тул л байна. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
