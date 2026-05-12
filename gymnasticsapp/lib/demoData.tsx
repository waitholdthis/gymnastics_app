import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Status = "working" | "mastered" | "competition_ready";
type Apparatus = "Vault" | "Bars" | "Beam" | "Floor";
type RecoveryCategory = "Conditioning" | "Stretching" | "Nutrition";

type User = { _id: string; username?: string; email: string; password: string };
type Gymnast = { _id: string; userId: string; name: string; level: string; club: string };
type Skill = { _id: string; name: string; apparatus: Apparatus; level: number; description?: string };
type Achievement = { _id: string; gymnastId: string; skillId: string; status: Status; updatedAt: number };
type WellnessLog = { _id: string; gymnastId: string; date: string; soreness: number; energy: number; mood: number; notes?: string };
type Meet = {
  _id: string;
  gymnastId: string;
  name: string;
  date: string;
  vaultScore?: number;
  barsScore?: number;
  beamScore?: number;
  floorScore?: number;
  personalWins: string;
  coachFeedback?: string;
};
type Schedule = {
  _id: string;
  gymnastId: string;
  title: string;
  type: "practice" | "meet";
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  reminderEnabled: boolean;
};
type Goal = { _id: string; gymnastId: string; text: string; category: "Technical" | "Confidence" | "Strength"; isAchieved: boolean; createdAt: number };
type CoachNote = { _id: string; gymnastId: string; date: string; note: string };
type AcademyItem = { _id: string; title: string; scenario: string; script: string; growthMindsetTip: string; category: string };
type RecoveryResource = { _id: string; title: string; description: string; category: RecoveryCategory; content: string; duration?: string; intensity?: string };
type Reel = { _id: string; gymnastId: string; uri: string; title: string; createdAt: number; duration?: string };

type DemoState = {
  currentUserId: string | null;
  users: User[];
  gymnasts: Gymnast[];
  skills: Skill[];
  achievements: Achievement[];
  wellnessLogs: WellnessLog[];
  meets: Meet[];
  schedules: Schedule[];
  goals: Goal[];
  coachNotes: CoachNote[];
  academyContent: AcademyItem[];
  recoveryResources: RecoveryResource[];
  reels: Reel[];
  quote: { text: string; author: string; category: string };
};

const today = new Date().toISOString().split("T")[0];
const gymnastId = "gymnast_maya";
const userId = "user_demo";
const storageKey = "aerovault-demo-state";

const initialSkills: Skill[] = [
  { _id: "skill_vault_1", name: "Straight Jump onto Mat", apparatus: "Vault", level: 1 },
  { _id: "skill_vault_3", name: "Handstand Flat Back", apparatus: "Vault", level: 3 },
  { _id: "skill_vault_4", name: "Handspring Vault", apparatus: "Vault", level: 4 },
  { _id: "skill_vault_7", name: "Handspring Full Twist", apparatus: "Vault", level: 7 },
  { _id: "skill_bars_2", name: "Pullover", apparatus: "Bars", level: 2 },
  { _id: "skill_bars_3", name: "Back Hip Circle", apparatus: "Bars", level: 3 },
  { _id: "skill_bars_4", name: "Kip", apparatus: "Bars", level: 4 },
  { _id: "skill_bars_6", name: "Clear Hip to Handstand", apparatus: "Bars", level: 6 },
  { _id: "skill_bars_7", name: "Giant Circle", apparatus: "Bars", level: 7 },
  { _id: "skill_beam_2", name: "Arabesque", apparatus: "Beam", level: 2 },
  { _id: "skill_beam_4", name: "Cartwheel", apparatus: "Beam", level: 4 },
  { _id: "skill_beam_5", name: "Back Walkover", apparatus: "Beam", level: 5 },
  { _id: "skill_beam_7", name: "Back Handspring Series", apparatus: "Beam", level: 7 },
  { _id: "skill_floor_1", name: "Forward Roll", apparatus: "Floor", level: 1 },
  { _id: "skill_floor_4", name: "Round-off Back Handspring", apparatus: "Floor", level: 4 },
  { _id: "skill_floor_6", name: "Front Handspring Front Tuck", apparatus: "Floor", level: 6 },
  { _id: "skill_floor_8", name: "Back Layout 1.5 Twist", apparatus: "Floor", level: 8 },
];

const initialState: DemoState = {
  currentUserId: null,
  users: [{ _id: userId, username: "Gym Parent", email: "demo@gymparent.local", password: "password" }],
  gymnasts: [{ _id: gymnastId, userId, name: "Maya", level: "Level 4", club: "Summit Gymnastics" }],
  skills: initialSkills,
  achievements: [
    { _id: "ach_1", gymnastId, skillId: "skill_bars_3", status: "mastered", updatedAt: Date.now() - 86400000 * 4 },
    { _id: "ach_2", gymnastId, skillId: "skill_bars_4", status: "working", updatedAt: Date.now() - 86400000 * 2 },
    { _id: "ach_3", gymnastId, skillId: "skill_beam_4", status: "competition_ready", updatedAt: Date.now() - 86400000 },
    { _id: "ach_4", gymnastId, skillId: "skill_floor_4", status: "mastered", updatedAt: Date.now() - 86400000 * 7 },
  ],
  wellnessLogs: [{ _id: "wellness_1", gymnastId, date: today, soreness: 2, energy: 4, mood: 5, notes: "A little heel soreness after floor, otherwise upbeat." }],
  meets: [{
    _id: "meet_1",
    gymnastId,
    name: "Spring Invitational",
    date: "2026-04-18",
    vaultScore: 9.05,
    barsScore: 8.75,
    beamScore: 9.15,
    floorScore: 9.2,
    personalWins: "Stayed calm on beam and stuck the final landing.",
    coachFeedback: "Keep pressing tall through the shoulders on vault.",
  }],
  schedules: [
    { _id: "schedule_1", gymnastId, title: "Team Practice", type: "practice", date: "2026-05-07", startTime: "16:00", endTime: "19:00", location: "Main Gym", reminderEnabled: true },
    { _id: "schedule_2", gymnastId, title: "State Qualifier", type: "meet", date: "2026-05-16", startTime: "09:00", endTime: "13:00", location: "Civic Center", reminderEnabled: true },
  ],
  goals: [
    { _id: "goal_1", gymnastId, text: "Three connected casts with tight hollow shape", category: "Technical", isAchieved: false, createdAt: Date.now() - 86400000 },
    { _id: "goal_2", gymnastId, text: "Use the same breath cue before every beam series", category: "Confidence", isAchieved: true, createdAt: Date.now() - 86400000 * 3 },
  ],
  coachNotes: [{ _id: "note_1", gymnastId, date: "2026-05-04", note: "Coach wants more patient shoulder opening before the kip." }],
  academyContent: [
    {
      _id: "academy_1",
      title: "The Tough Practice Talk",
      scenario: "Your gymnast leaves practice frustrated because a skill did not click.",
      script: "I saw how much effort you put in today. What is one tiny thing you are proud of from practice?",
      growthMindsetTip: "Praise the process and name the next small step.",
      category: "After Practice",
    },
    {
      _id: "academy_2",
      title: "Handling New Skill Fear",
      scenario: "They are nervous to try a new skill on the high beam.",
      script: "It makes sense that your body feels alert. Brave can mean taking the next prepared step.",
      growthMindsetTip: "Validate fear without making it the boss of the plan.",
      category: "Fear & Anxiety",
    },
    {
      _id: "academy_3",
      title: "Competition Reset",
      scenario: "A fall early in the meet makes the rest of the day feel heavy.",
      script: "One event is not the whole meet. What cue do you want for the next routine?",
      growthMindsetTip: "Help them reset attention toward controllable cues.",
      category: "Competition",
    },
  ],
  recoveryResources: [
    {
      _id: "recovery_1",
      title: "10-Minute Post-Practice Flow",
      description: "A gentle mobility sequence for tight hips, calves, wrists, and shoulders.",
      category: "Stretching",
      duration: "10 mins",
      intensity: "Low",
      content: "Pike stretch, straddle side reaches, seal stretch, cat/cow, wrist circles, and forearm release.",
    },
    {
      _id: "recovery_2",
      title: "Core Line Builder",
      description: "Low-impact shapes that reinforce hollow and arch positions.",
      category: "Conditioning",
      duration: "12 mins",
      intensity: "Medium",
      content: "Hollow holds, arch rocks, side planks, dead bugs, and controlled V-ups.",
    },
    {
      _id: "recovery_3",
      title: "Practice Day Fuel",
      description: "Balanced meal and snack ideas for long training blocks.",
      category: "Nutrition",
      content: "Pair complex carbs with protein: oats and yogurt, turkey wrap with fruit, or rice bowl with eggs.",
    },
  ],
  reels: [],
  quote: {
    text: "Progress is not always a straight line. The plateau is where the real strength is built.",
    author: "Coach Sarah",
    category: "Growth Mindset",
  },
};

function getStoredState() {
  const storage = globalThis.localStorage;

  if (!storage) return initialState;

  try {
    const stored = storage.getItem(storageKey);
    if (!stored) return initialState;

    return {
      ...initialState,
      ...JSON.parse(stored),
      skills: initialState.skills,
      academyContent: initialState.academyContent,
      recoveryResources: initialState.recoveryResources,
      quote: initialState.quote,
    } as DemoState;

  } catch {
    return initialState;
  }
}

const queryNames = [
  "currentUser",
  "getGymnast",
  "getAchievements",
  "getLatestWellness",
  "getQuote",
  "getAcademyContent",
  "getMeets",
  "getRecoveryResources",
  "getGoals",
  "getCoachNotes",
  "getSchedules",
  "getSkillsByApparatus",
  "getReels",
] as const;

const mutationNames = [
  "updateProfile",
  "createGymnast",
  "addMeetEntry",
  "addGoal",
  "toggleGoal",
  "addCoachNote",
  "addSchedule",
  "updateSkillStatus",
  "logWellness",
  "addReel",
  "deleteReel",
] as const;

export const api = {
  gymnasts: Object.fromEntries([...queryNames, ...mutationNames].map((name) => [name, name])),
} as { gymnasts: Record<(typeof queryNames)[number] | (typeof mutationNames)[number], string> };

const DemoDataContext = createContext<{
  state: DemoState;
  setState: React.Dispatch<React.SetStateAction<DemoState>>;
} | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(getStoredState);
  const value = useMemo(() => ({ state, setState }), [state]);

  useEffect(() => {
    const storage = globalThis.localStorage;
    if (!storage) return;

    storage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error("DemoDataProvider is missing");
  }
  return context;
}

export function useQuery(name: string, args?: any): any {
  const { state } = useDemoData();
  const currentUser = state.currentUserId
    ? state.users.find((user) => user._id === state.currentUserId) ?? null
    : null;

  if (args === "skip") return undefined;

  switch (name) {
    case "currentUser":
      return currentUser;
    case "getGymnast":
      if (!currentUser) return null;
      return state.gymnasts.find((gymnast) => gymnast.userId === currentUser._id) ?? null;
    case "getAchievements":
      return state.achievements
        .filter((achievement) => achievement.gymnastId === args.gymnastId)
        .map((achievement) => {
          const skill = state.skills.find((item) => item._id === achievement.skillId);
          return { ...achievement, skillName: skill?.name ?? "Unknown Skill", apparatus: skill?.apparatus ?? "Floor" };
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
    case "getLatestWellness":
      return state.wellnessLogs
        .filter((item) => item.gymnastId === args.gymnastId)
        .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
    case "getQuote":
      return state.quote;
    case "getAcademyContent":
      return state.academyContent;
    case "getMeets":
      return state.meets.filter((item) => item.gymnastId === args.gymnastId).sort((a, b) => b.date.localeCompare(a.date));
    case "getRecoveryResources":
      return args?.category ? state.recoveryResources.filter((item) => item.category === args.category) : state.recoveryResources;
    case "getGoals":
      return state.goals.filter((item) => item.gymnastId === args.gymnastId).sort((a, b) => b.createdAt - a.createdAt);
    case "getCoachNotes":
      return state.coachNotes.filter((item) => item.gymnastId === args.gymnastId).sort((a, b) => b.date.localeCompare(a.date));
    case "getSchedules":
      return state.schedules.filter((item) => item.gymnastId === args.gymnastId).sort((a, b) => a.date.localeCompare(b.date));
    case "getSkillsByApparatus":
      return args?.apparatus ? state.skills.filter((item) => item.apparatus === args.apparatus) : state.skills;
    case "getReels":
      return state.reels.filter((item) => item.gymnastId === args?.gymnastId).sort((a, b) => b.createdAt - a.createdAt);
    default:
      return undefined;
  }
}

export function useMutation(name: string) {
  const { state: currentState, setState } = useDemoData();

  return async (args: any) => {
    const id = `${name}_${Date.now()}`;

    if (name === "updateProfile") {
      const username = args.username.trim();

      if (!username) {
        throw new Error("Please choose a username.");
      }

      if (
        currentState.users.some(
          (user) =>
            user._id !== currentState.currentUserId &&
            user.username?.toLowerCase() === username.toLowerCase()
        )
      ) {
        throw new Error("That username is already taken.");
      }
    }

    setState((state) => {
      const currentUserId = state.currentUserId;

      switch (name) {
        case "updateProfile":
          if (!currentUserId) return state;
          return {
            ...state,
            users: state.users.map((user) =>
              user._id === currentUserId ? { ...user, username: args.username.trim() } : user
            ),
          };
        case "createGymnast":
          if (!currentUserId) return state;
          return { ...state, gymnasts: [{ _id: id, userId: currentUserId, ...args }, ...state.gymnasts] };
        case "addMeetEntry":
          return { ...state, meets: [{ _id: id, ...args }, ...state.meets] };
        case "addGoal":
          return { ...state, goals: [{ _id: id, ...args, isAchieved: false, createdAt: Date.now() }, ...state.goals] };
        case "toggleGoal":
          return { ...state, goals: state.goals.map((goal) => goal._id === args.goalId ? { ...goal, isAchieved: args.isAchieved } : goal) };
        case "addCoachNote":
          return { ...state, coachNotes: [{ _id: id, gymnastId: args.gymnastId, note: args.note, date: today }, ...state.coachNotes] };
        case "addSchedule":
          return { ...state, schedules: [{ _id: id, ...args }, ...state.schedules] };
        case "updateSkillStatus": {
          const existing = state.achievements.find((item) => item.gymnastId === args.gymnastId && item.skillId === args.skillId);
          if (existing) {
            return {
              ...state,
              achievements: state.achievements.map((item) => item._id === existing._id ? { ...item, status: args.status, updatedAt: Date.now() } : item),
            };
          }
          return { ...state, achievements: [{ _id: id, ...args, updatedAt: Date.now() }, ...state.achievements] };
        }
        case "logWellness": {
          const existing = state.wellnessLogs.find((item) => item.gymnastId === args.gymnastId && item.date === today);
          if (existing) {
            return { ...state, wellnessLogs: state.wellnessLogs.map((item) => item._id === existing._id ? { ...item, ...args } : item) };
          }
          return { ...state, wellnessLogs: [{ _id: id, date: today, ...args }, ...state.wellnessLogs] };
        }
        case "addReel":
          return { ...state, reels: [{ _id: id, createdAt: Date.now(), ...args }, ...state.reels] };
        case "deleteReel":
          return { ...state, reels: state.reels.filter((r) => r._id !== args.reelId) };
        default:
          return state;
      }
    });

    return id;
  };
}

export function useAuthActions() {
  const { state, setState } = useDemoData();

  return {
    signOut: async () => {
      setState((current) => ({ ...current, currentUserId: null }));
    },
    signIn: async (identifier: string, password: string) => {
      const normalizedIdentifier = identifier.trim().toLowerCase();
      const user = state.users.find((item) => {
        const emailMatches = item.email.toLowerCase() === normalizedIdentifier;
        const usernameMatches = item.username?.toLowerCase() === normalizedIdentifier;

        return emailMatches || usernameMatches;
      });

      if (!user || user.password !== password) {
        throw new Error("That username/email and password do not match an Ascent account.");
      }

      setState((current) => ({ ...current, currentUserId: user._id }));
    },
    signUp: async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail.includes("@")) {
        throw new Error("Enter a valid email address.");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      if (state.users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
        throw new Error("An account already exists for this email. Sign in instead.");
      }

      const user = {
        _id: `user_${Date.now()}`,
        email: normalizedEmail,
        password,
      };

      setState((current) => ({
        ...current,
        currentUserId: user._id,
        users: [...current.users, user],
      }));
    },
  };
}
