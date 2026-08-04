// Types partagés — reflètent EXACTEMENT les schémas Pydantic du backend
// canonique (celui du matin, modèle de match interne équipe A / équipe B).
// Fichier UNIQUE : ne jamais redéfinir ces types ailleurs.

export interface ClubMembershipResponse {
  id: number;
  club_id: number;
  club_name: string;
  status: string;
  jersey_number: number | null;
  joined_at: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  position: string | null;
  photo_url: string | null;
  phone: string | null;
  role: string;
  total_goals: number;
  matches_played: number;
  created_at?: string;
  updated_at?: string;
  memberships?: ClubMembershipResponse[]; // présent sur /players/me (PlayerProfileResponse)
}

export interface GoalCurvePoint {
  match_id: number;
  match_date: string;
  match_opponent: string;
  goals_scored: number;
  cumulative_goals: number;
  match_result: 'W' | 'D' | 'L';
}

export interface PlayerStatsResponse {
  player_id: number;
  player_name: string;
  player_photo: string | null;
  position: string;
  total_goals: number;
  total_assists: number;
  matches_played: number;
  matches_won: number;
  matches_drawn: number;
  matches_lost: number;
  goals_per_match: number;
  win_rate: number;
  goal_curve: GoalCurvePoint[];
  recent_form: string[];
}

export interface GoalResponse {
  id: number;
  match_id: number;
  scorer_id: number;
  scorer_name: string;
  scorer_photo: string | null;
  assist_id: number | null;
  assist_name: string | null;
  minute: number | null;
  goal_type: string;
  created_at: string;
}

export type MatchTeam = 'team_a' | 'team_b';

export interface LineupResponse {
  player_id: number;
  player_name: string;
  player_photo: string | null;
  team: MatchTeam;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled' | 'postponed';

// Match INTERNE au club : équipe A vs équipe B, composition variable à
// chaque match (voir docs/2-0-documentation-technique.md §4).
export interface MatchResponse {
  id: number;
  club_id: number;
  match_date: string;
  location: string | null;
  score_team_a: number;
  score_team_b: number;
  status: MatchStatus;
  goals: GoalResponse[];
  lineups: LineupResponse[];
  winner: MatchTeam | null;
  is_draw: boolean;
  created_at: string;
}

export interface ContributionResponse {
  id: number;
  title: string;
  description: string | null;
  amount_total: number;
  amount_collected: number;
  status: string;
  progress_percentage: number;
  remaining_amount: number;
  participant_count: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ClubList {
  id: number;
  name: string;
  motto: string | null;
  logo_url: string | null;
  member_count: number;
  primary_color: string;
}

export const PLAYER_POSITIONS = [
  'Gardien', 'Défenseur Central', 'Latéral Gauche', 'Latéral Droit',
  'Milieu Défensif', 'Milieu Central', 'Milieu Offensif',
  'Ailier Gauche', 'Ailier Droit', 'Attaquant',
];

export interface LeaderboardEntry {
  rank: number;
  player_id: number;
  player_name: string;
  player_photo: string | null;
  position: string;
  goals: number;
  assists: number;
  matches: number;
  points: number;
}
