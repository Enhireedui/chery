/* Заалтын сум. Хөдөлгөөн нь ЭНД биш, эцэг элементийн `:hover`
   дээр CSS-ээр (`.ms-arrow`) — сум өөрөө юуг ч мэдэхгүй, зөвхөн
   зурагдана. Ингэснээр товч, карт, холбоос гурвуулаа ижил сум
   хуваалцаж, тус бүр өөрийн хөдөлгөөнөө шийднэ. */
export default function AnimatedArrowIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      className="ms-arrow"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
