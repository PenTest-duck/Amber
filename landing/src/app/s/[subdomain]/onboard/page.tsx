import { Suspense } from "react";
import OnboardPage from "./OnboardPage";

export default async function OnboardPageWrapper() {
  return (
    <Suspense fallback={null}>
      <OnboardPage />
    </Suspense>
  );
}
