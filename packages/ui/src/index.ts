// ─── Silk Value — UI Package Public API ──────────────────────────────────────
export { theme } from "./theme";
export type { Theme } from "./theme";
export { PrimaryButton } from "./components/PrimaryButton";
export { SecondaryButton } from "./components/SecondaryButton";
export { TextInputField } from "./components/TextInputField";
export { OtpInputField } from "./components/OtpInputField";
export { AppLogo } from "./components/AppLogo";
// Removed duplicate export * statements
// ── Home Dashboard components (02_home_route_updated) ────────────────────────
export { AppWordmark } from "./components/AppWordmark";
export { SyncStatusIndicator } from "./components/SyncStatusIndicator";
export type { SyncStatusIndicatorProps } from "./components/SyncStatusIndicator";
export { RouteProgressBar } from "./components/RouteProgressBar";
export type { RouteProgressBarProps } from "./components/RouteProgressBar";
export { StopCard } from "./components/StopCard";
export type { StopCardProps } from "./components/StopCard";
export { BottomNavBar } from "./components/BottomNavBar";
export type { BottomNavBarProps, TabName } from "./components/BottomNavBar";

// ── Route Map Screen components (03_route_map) ───────────────────────────────
export { MapPlaceholder } from "./components/MapPlaceholder";
export type { MapPlaceholderProps } from "./components/MapPlaceholder";
export { StopListCard } from "./components/StopListCard";
export type { StopListCardProps } from "./components/StopListCard";

// ── Reeler App components ────────────────────────────────────────────────────
export { ReelerBottomNavBar } from "./components/ReelerBottomNavBar";
export type { ReelerBottomNavBarProps, ReelerTabName } from "./components/ReelerBottomNavBar";
export { QRCodeDisplay } from "./components/QRCodeDisplay";
export type { QRCodeDisplayProps } from "./components/QRCodeDisplay";
export { PaymentStatusBadge } from "./components/PaymentStatusBadge";
export type { PaymentStatusBadgeProps, PaymentStatusType } from "./components/PaymentStatusBadge";
export { CollectionHistoryCard } from "./components/CollectionHistoryCard";
export type { CollectionHistoryCardProps } from "./components/CollectionHistoryCard";
export { KycStatusBanner } from "./components/KycStatusBanner";
export type { KycStatusBannerProps, KycStatus } from "./components/KycStatusBanner";

// ── Factory Gate App components ──────────────────────────────────────────────
export { StepProgressBar } from "./components/StepProgressBar";
export type { StepProgressBarProps, StepConfig } from "./components/StepProgressBar";
export { VehicleCard } from "./components/VehicleCard";
export type { VehicleCardProps, VehicleCardStatus } from "./components/VehicleCard";
export { GateBottomNavBar } from "./components/GateBottomNavBar";
export type { GateBottomNavBarProps, GateTabName } from "./components/GateBottomNavBar";
