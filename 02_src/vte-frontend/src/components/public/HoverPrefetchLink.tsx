"use client";

import Link from "next/link";
import { useState, type ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "prefetch">;

/**
 * Ссылка публичной части: предзагружает маршрут не при появлении на экране, а
 * при наведении или фокусе.
 *
 * Штатный <Link> тянет каждый маршрут, попавший во вьюпорт. Шапка и подвал видны
 * на любой странице, поэтому один показ страницы отправлял на сервер около
 * дюжины лишних запросов за маршрутами, куда читатель не пошёл, — вместе с
 * документом и файлами сборки выходило порядка сорока. Это выбирает лимит nginx
 * (60 запросов в минуту на адрес), и дальше предзагрузки получают 503 либо
 * подвисают в очереди, а вкладка не дозагружается.
 *
 * Приём взят из документации Next 16 («Preventing too many prefetches»):
 * пока ссылку не тронули, prefetch={false}; после наведения — auto (null),
 * то есть обычное поведение. Фокус учитываем наравне с мышью, иначе с
 * клавиатуры переход остался бы без предзагрузки.
 */
export default function HoverPrefetchLink({ onMouseEnter, onFocus, ...props }: Props) {
  const [armed, setArmed] = useState(false);

  return (
    <Link
      {...props}
      prefetch={armed ? null : false}
      onMouseEnter={(e) => {
        setArmed(true);
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        setArmed(true);
        onFocus?.(e);
      }}
    />
  );
}
