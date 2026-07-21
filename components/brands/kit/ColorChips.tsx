// The Color section, reduced to paint chips (brand.colorLayout === "chips").
//
// Same section shell as ColorSystem — the construction lines and 64px rhythm are
// the page's, not the inspector's — but the big swatch, the HEX/RGB/HSL readout
// and the contrast cards are dropped. For a brand whose palette is two short
// ramps, that panel is a lot of chrome around six values you can already see.
// The chips stay copy-on-click, so nothing is actually lost.
import ColorLineup from "@/components/brands/kit/ColorLineup";

export default function ColorChips() {
  return (
    <section id="color-config" className="px-edge pb-section pt-16">
      <div className="statement">
        <ColorLineup />
      </div>
    </section>
  );
}
