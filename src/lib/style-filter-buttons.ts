export function filterClass(active: boolean) {
  return `w-fit h-fit ml-0.5 mr-0.5 px-5 py-0.5 pt-1 rounded-md text-center text-sm normal-case appearance-none outline-none cursor-pointer
  ${active ? "bg-blue-100/50" : "bg-secondary/15"}
  ${active ? "text-blue-500" : "text-primary"}
  ${active ? "ring ring-blue-400" : ""}
  `;
}
