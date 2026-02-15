export interface TutorialCharacter {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: {
    atk: number;
    def: number;
    mag: number;
    res: number;
    spd: number;
    crit: number;
  };
}

export function createTutorialCharacter(playerName: string): TutorialCharacter {
  return {
    id: "player",
    name: playerName,
    level: 1,
    experience: 0,
    maxExperience: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    stats: {
      atk: 10,
      def: 8,
      mag: 5,
      res: 5,
      spd: 10,
      crit: 5,
    },
  };
}
