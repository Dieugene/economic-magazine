import type { NextConfig } from "next";

import { legacyRedirects } from "./src/lib/legacy-redirects.generated";

const nextConfig: NextConfig = {
  output: "standalone",
  // Match Django's URL convention (paths end with `/`).
  trailingSlash: true,
  // Адреса старого сайта, на которые указывают зарегистрированные DOI статей: без этих
  // правил DOI-ссылки в чужих публикациях ведут в 404. Карта генерируется скриптом
  // scripts/legacy-redirects/generate.mjs — руками её не правят.
  //
  // statusCode: 301, а не permanent: true — тот даёт 308, а по этим адресам ходят в том
  // числе древние линк-чекеры и боты, для которых 301 привычнее. Метод здесь всегда GET,
  // так что разницы в семантике нет.
  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({
      source,
      destination,
      statusCode: 301,
    }));
  },
  experimental: {
    // PDF выпусков журнала — до 20 МБ. Без этого Next.js 16 молча обрезает
    // тело route handler-а на 10 МБ (см. proxyClientMaxBodySize в доках).
    proxyClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
