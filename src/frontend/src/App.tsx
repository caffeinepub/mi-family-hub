import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import type React from "react";
import { AuthenticatedApp } from "./components/AuthenticatedApp";
import { LandingPage } from "./components/LandingPage";
import { LoadingScreen } from "./components/LoadingScreen";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useFamilyStatus } from "./hooks/useQueries";

const App: React.FC = () => {
  const { identity, isInitializing, clear: logout } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { actor, isFetching: isActorFetching } = useActor();

  const {
    data: familyStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useFamilyStatus();

  // Determine which content to render
  let content: React.ReactNode;

  if (isInitializing) {
    // Initializing identity - show loading screen
    content = <LoadingScreen />;
  } else if (!isAuthenticated) {
    // Not authenticated - show login page
    content = <LandingPage />;
  } else if (!actor || isActorFetching || isLoadingStatus || !familyStatus) {
    // Loading actor or family status - show loading screen
    // Only check initial loading (isLoading), NOT refetching (isFetching)
    // This prevents unmounting AuthenticatedApp during refetches
    content = <LoadingScreen />;
  } else {
    // Authenticated and family status loaded - show authenticated app
    // Key ensures component remounts and resets local state when identity changes
    content = (
      <AuthenticatedApp
        key={identity?.getPrincipal().toString()}
        familyStatus={familyStatus}
        refetchStatus={refetchStatus}
        onLogout={logout}
      />
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {content}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
};

export default App;
