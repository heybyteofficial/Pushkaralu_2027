function PushkarAvatar({ className = "h-10 w-10" }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#16132b] ${className}`}
    >
      <svg viewBox="0 0 64 64" className="h-[62%] w-[62%]" aria-hidden="true">
        <path
          fill="#7c3aed"
          d="M32 4c2 13.2 8.8 20 22 22-13.2 2-20 8.8-22 22-2-13.2-8.8-20-22-22 13.2-2 20-8.8 22-22z"
        />
        <path
          fill="#ddd6fe"
          d="M32 16c1 7 4.4 10.4 11.4 11.4-7 1-10.4 4.4-11.4 11.4-1-7-4.4-10.4-11.4-11.4 7-1 10.4-4.4 11.4-11.4z"
        />
      </svg>
    </span>
  );
}

export default PushkarAvatar;
