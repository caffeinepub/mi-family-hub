import type React from "react";
import { useState } from "react";
import type { FamilyStatus } from "../backend";
import type { TabId } from "../constants";
import { CalendarPage } from "./CalendarPage";
import { ChoresPage } from "./ChoresPage";
import { CreateFamily } from "./CreateFamily";
import { Dashboard } from "./Dashboard";
import { FamilyPage } from "./FamilyPage";
import { JoinFamily } from "./JoinFamily";
import { Layout } from "./Layout";
import { LoadingScreen } from "./LoadingScreen";
import { MealsPage } from "./MealsPage";
import { MoodPage } from "./MoodPage";
import { OnboardingChoice } from "./OnboardingChoice";
import { SettingsPage } from "./SettingsPage";
import { ShoppingPage } from "./ShoppingPage";

type OnboardingStep = "choice" | "create" | "join";

interface AuthenticatedAppProps {
  familyStatus: FamilyStatus;
  refetchStatus: () => Promise<any>;
  onLogout: () => void;
}

export const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  familyStatus,
  refetchStatus,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>("choice");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isLinked = familyStatus.__kind__ !== "NotLinked";

  // Show loading screen during transition after onboarding
  if (isTransitioning) {
    return <LoadingScreen />;
  }

  // User not linked - show onboarding flow
  if (!isLinked) {
    const handleOnboardingSuccess = async () => {
      setIsTransitioning(true);
      await refetchStatus();
      setOnboardingStep("choice");
      setIsTransitioning(false);
    };

    switch (onboardingStep) {
      case "create":
        return (
          <CreateFamily
            onBack={() => setOnboardingStep("choice")}
            onSuccess={handleOnboardingSuccess}
          />
        );
      case "join":
        return (
          <JoinFamily
            onBack={() => setOnboardingStep("choice")}
            onSuccess={handleOnboardingSuccess}
          />
        );
      default:
        return (
          <OnboardingChoice
            onCreateFamily={() => setOnboardingStep("create")}
            onJoinFamily={() => setOnboardingStep("join")}
            onLogout={onLogout}
          />
        );
    }
  }

  // User is linked - show main app
  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "dashboard" && <Dashboard />}
      {activeTab === "family" && <FamilyPage />}
      {activeTab === "chores" && <ChoresPage />}
      {activeTab === "mood" && <MoodPage />}
      {activeTab === "calendar" && <CalendarPage />}
      {activeTab === "meals" && <MealsPage />}
      {activeTab === "shopping" && <ShoppingPage />}
      {activeTab === "settings" && <SettingsPage />}
    </Layout>
  );
};
