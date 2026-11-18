import apLogo from "@/assets/ap-govt-logo.png";

function PushkarAvatar({ className = "h-10 w-10" }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ${className}`}
    >
      <img src={apLogo} alt="Andhra Pradesh Government" className="h-[86%] w-[86%] object-contain" />
    </span>
  );
}

export default PushkarAvatar;
