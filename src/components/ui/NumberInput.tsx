import React, { useEffect, useState } from 'react';

interface NumberInputProps {
  /** Undefined renders as an empty field so the placeholder shows through. */
  value?: number;
  onCommit: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  id?: string;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  title?: string;
}

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;
const toDraft = (v?: number) => (typeof v === 'number' && Number.isFinite(v) ? String(v) : '');

/**
 * Signed decimal input that keeps the raw text the user is typing.
 *
 * The observation inputs used to run parseFloat() on every keystroke and coerce
 * NaN to 0, which made a leading minus sign impossible to type — so a negative
 * zero error (required by the Vernier and screw gauge practicals) could never be
 * entered. Here the draft string is preserved while the field is focused and only
 * parsed once it is a valid number, so "-", "0." and "" all survive editing.
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onCommit,
  step = 0.01,
  min,
  max,
  id,
  className,
  placeholder,
  ariaLabel,
  title,
}) => {
  const [draft, setDraft] = useState<string>(() => toDraft(value));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Keep the visible text in sync when the value changes from outside
  // (Reset, Sample Data, simulator logging) but never while the user is typing.
  useEffect(() => {
    if (!isEditing) setDraft(toDraft(value));
  }, [value, isEditing]);

  const clamp = (n: number) => {
    let out = n;
    if (typeof min === 'number') out = Math.max(min, out);
    if (typeof max === 'number') out = Math.min(max, out);
    return round6(out);
  };

  const parseDraft = (text: string): number | null => {
    const trimmed = text.trim();
    if (trimmed === '' || trimmed === '-' || trimmed === '.' || trimmed === '-.') return null;
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setDraft(text);
    const parsed = parseDraft(text);
    // Commit as soon as the draft is a valid number so derived columns stay live,
    // but leave an intermediate "-" or "" alone instead of writing 0.
    if (parsed !== null) onCommit(clamp(parsed));
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseDraft(draft);
    if (parsed === null) {
      setDraft(toDraft(value));
      return;
    }
    const clamped = clamp(parsed);
    onCommit(clamped);
    setDraft(toDraft(clamped));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const parsed = parseDraft(draft);
    const base = parsed !== null ? parsed : typeof value === 'number' && Number.isFinite(value) ? value : 0;
    const next = clamp(base + (e.key === 'ArrowUp' ? step : -step));
    setDraft(toDraft(next));
    onCommit(next);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={draft}
      placeholder={placeholder}
      title={title}
      aria-label={ariaLabel}
      onFocus={() => setIsEditing(true)}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
};
