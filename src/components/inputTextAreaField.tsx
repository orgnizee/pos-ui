import { baseInput, baseLabel, errorText, floatedLabel } from "./inputField";

type TextareaProps = {
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function InputTextareaField({ label, error, ...props }: TextareaProps) {
  return (
    <div className="relative mt-6">
      <textarea
        placeholder=" "
        rows={4}
        {...props}
        className={`${baseInput} resize-none ${
          error ? "border-red-500 focus:border-red-500" : ""
        }`}
      />
      <label
        className={`${baseLabel} ${floatedLabel}
          peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm
          peer-not-placeholder-shown:-top-3.5 peer-not-placeholder-shown:text-[12px]
          ${error ? "text-red-500" : ""}`}
      >
        {label}
      </label>
      {error && <p className={errorText}>{error}</p>}
    </div>
  );
}
