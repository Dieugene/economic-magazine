import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: Props) {
  return (
    <section className="bg-white border border-stone-400 rounded-sm p-6">
      <h2 className="font-serif text-xl font-semibold text-forest-600 mb-1">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}
      <div className={description ? "mt-2" : "mt-4"}>{children}</div>
    </section>
  );
}
