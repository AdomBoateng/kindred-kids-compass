import logo from "@/assets/logo.png";

export function LogoLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center gap-3">
      <img src={logo} alt="Loading" className="h-14 w-14 rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
