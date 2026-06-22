import { Check, X } from "lucide-react";

export function WhyYesBlock({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Check className="h-3 w-3" />
          </span>
          <span className="text-sm text-ink-600">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function WhyNotBlock({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <X className="h-3 w-3" />
          </span>
          <span className="text-sm text-ink-600">{item}</span>
        </li>
      ))}
    </ul>
  );
}
