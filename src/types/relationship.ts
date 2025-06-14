
export interface LoveLanguage {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const LOVE_LANGUAGES: LoveLanguage[] = [
  {
    id: 'words_of_affirmation',
    name: 'Words of Affirmation',
    description: 'Verbal and written expressions of love',
    icon: '💬'
  },
  {
    id: 'quality_time',
    name: 'Quality Time',
    description: 'Focused, uninterrupted time together',
    icon: '⏰'
  },
  {
    id: 'physical_touch',
    name: 'Physical Touch',
    description: 'Appropriate physical contact and closeness',
    icon: '🤗'
  },
  {
    id: 'acts_of_service',
    name: 'Acts of Service',
    description: 'Helpful actions and thoughtful gestures',
    icon: '🛠️'
  },
  {
    id: 'receiving_gifts',
    name: 'Receiving Gifts',
    description: 'Thoughtful presents and tokens of love',
    icon: '🎁'
  }
];

export interface GratitudeNote {
  id: string;
  message: string;
  senderEmail: string;
  receiverEmail: string;
  senderNickname: string;
  timestamp: any;
  mood: string;
}

export interface RelationshipMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  coupleEmails: string[];
  createdBy: string;
}
