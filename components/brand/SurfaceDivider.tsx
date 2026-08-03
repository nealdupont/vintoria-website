import { RippleMark } from "@/components/brand/RippleMark";

/** Séparateur « surface » — le fil conducteur de la goutte entre les sections. */
export function SurfaceDivider() {
  return (
    <div className="section-x">
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <span className="luminous-line flex-1" />
        <RippleMark size={26} />
        <span className="luminous-line flex-1" />
      </div>
    </div>
  );
}
