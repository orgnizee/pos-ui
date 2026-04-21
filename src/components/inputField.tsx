export const baseInput =
  "peer w-full border-b border-secondary bg-transparent py-2 text-sm tracking-wide outline-none focus:border-black transition-colors";

export const baseLabel =
  "absolute left-0 top-2 text-sm text-tertiary transition-all pointer-events-none";

export const floatedLabel =
  "peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:text-black";

export const errorText = "mt-1.5 text-[11px] text-red-500";

type InputProps = {
  label: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField({
  label,
  type = "text",
  error,
  ...props
}: InputProps) {
  return (
    <div className="relative mt-6">
      <input
        type={type}
        placeholder=" "
        {...props}
        className={`${baseInput} ${
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
