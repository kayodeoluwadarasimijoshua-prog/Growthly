export type LaunchConfigReport = {
  mode: "production" | "private-review";
  configurationOK: boolean;
  launchApproved: false;
  scope: string;
  checks: {
    id: string;
    status: "pass" | "blocked" | "manual";
    message: string;
  }[];
  manualGates: string[];
};
export function checkLaunchConfig(
  env?: Record<string, string | undefined>,
  options?: { production?: boolean },
): LaunchConfigReport;
