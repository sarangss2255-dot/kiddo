export type KiddoAvatar = {
  id: string;
  emoji: string;
  label: string;
};

/** Single shared avatar catalog for onboarding, settings and the kid dashboard. */
export const AVATARS: readonly KiddoAvatar[] = [
  { id: 'fox', emoji: '🦊', label: 'Fox' },
  { id: 'cat', emoji: '🐱', label: 'Cat' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'lion', emoji: '🦁', label: 'Lion' },
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn' },
  { id: 'koala', emoji: '🐨', label: 'Koala' },
  { id: 'dino', emoji: '🦖', label: 'Dinosaur' },
  { id: 'bee', emoji: '🐝', label: 'Bee' },
  { id: 'bear', emoji: '🐻', label: 'Bear' },
];

export const DEFAULT_AVATAR = AVATARS[0].emoji;

/** Older web signups stored names such as "FOX"; keep them rendering correctly. */
const LEGACY_AVATARS: Record<string, string> = {
  FOX: '🦊',
  CAT: '🐱',
  PANDA: '🐼',
  LION: '🦁',
  UNICORN: '🦄',
  KOALA: '🐨',
  DINO: '🦖',
  DINOSAUR: '🦖',
  BEE: '🐝',
  BEAR: '🐻',
};

export function resolveAvatar(value?: string | null) {
  if (!value) return DEFAULT_AVATAR;
  return LEGACY_AVATARS[value.trim().toUpperCase()] ?? value;
}

export function isKnownAvatar(value?: string | null) {
  if (!value) return false;
  return AVATARS.some((avatar) => avatar.emoji === resolveAvatar(value));
}
