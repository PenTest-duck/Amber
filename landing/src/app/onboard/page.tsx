import { Suspense } from "react";
import OnboardPage from "./OnboardPage";

export default function OnboardPageWrapper() {
  return (
    <Suspense fallback={null}>
      <OnboardPage />
    </Suspense>
  );
}
