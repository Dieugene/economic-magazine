import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Публичная часть ходит по ссылкам через HoverPrefetchLink: штатный <Link>
    // предзагружает каждый маршрут, попавший во вьюпорт, и один показ страницы
    // отправляет на сервер около дюжины лишних запросов. Подробности — в шапке
    // самого компонента.
    files: ["src/app/(public)/**/*.{ts,tsx}", "src/components/public/**/*.{ts,tsx}"],
    ignores: ["src/components/public/HoverPrefetchLink.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message:
                "В публичной части используйте @/components/public/HoverPrefetchLink — он предзагружает маршрут по наведению, а не при появлении на экране.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
