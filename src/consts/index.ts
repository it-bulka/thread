export enum Pages {
  HOME = '/',
  ACTIVITY = '/activity',
  CREATE_THREAD = '/thread/create',
  COMMUNITIES = '/communities',
  PROFILE = '/profile',
  PROFILE_EDIT = '/profile/edit',
  ONBOARDING = '/onboarding',
  SEARCH = '/search',
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
  THREAD = '/thread'
}

export enum Models {
  USER = 'User',
  THREAD = 'Thread',
  COMMUNITY = 'Community'
}

export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: Pages.HOME,
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: Pages.SEARCH,
    label: "Search",
  },
  {
    imgURL: "/assets/heart.svg",
    route: Pages.ACTIVITY,
    label: "Activity",
  },
  {
    imgURL: "/assets/create.svg",
    route: Pages.CREATE_THREAD,
    label: "Create Thread",
  },
  {
    imgURL: "/assets/community.svg",
    route: Pages.COMMUNITIES,
    label: "Communities",
  },
  {
    imgURL: "/assets/user.svg",
    route: Pages.PROFILE,
    label: "Profile",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];

export const activityTabs = [
  { value: "liked-me", label: "Liked me", icon: "/assets/heart.svg" },
  { value: "my-likes", label: "My likes", icon: "/assets/heart-filled.svg" },
];