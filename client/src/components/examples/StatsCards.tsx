import { StatsCards } from "../StatsCards";

export default function StatsCardsExample() {
  // todo: remove mock functionality
  return (
    <StatsCards
      totalItems={156}
      checkedIn={142}
      checkedOut={14}
      recentScans={23}
    />
  );
}
