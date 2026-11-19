type SectionTabsProps<T extends string> = {
  label: string;
  items: readonly T[];
  value: T;
  counts?: Partial<Record<T, number>>;
  onChange: (value: T) => void;
};

export function SectionTabs<T extends string>({
  label,
  items,
  value,
  counts,
  onChange,
}: SectionTabsProps<T>) {
  return (
    <div role="group" aria-label={label} className="section-tabs">
      {items.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={item === value}
          onClick={() => onChange(item)}
        >
          {item}
          {counts?.[item] !== undefined && <span>{counts[item]}</span>}
        </button>
      ))}
    </div>
  );
}
