// ─── Navigation Types ────────────────────────────────────────────────────────

export type AuthStackParamList = {
  LanguageSelection: undefined;
  Login: undefined;
  OtpVerify: { phoneNumber: string };
  KycSubmission: undefined;
  AccountStatus: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  CollectionsTab: undefined;
  PaymentsTab: undefined;
  ProfileTab: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  CollectionDetail: { collectionId: string };
  Notifications: undefined;
};
