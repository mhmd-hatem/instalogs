export declare global {
  type TUser = {
    id: number;
    slug: string;
    fName: string;
    lName: string;
    username: string;
    email: string;
    // image: string;
  };

  type TAction = {
    id: number;
    slug: string;
    name: string;
    description: string;
  };

  type TTeam = {
    id: number;
    name: string;
    slug: string;
  };

  type TIncident = {
    id: number;
    name: string;
    slug: string;
  };

  type TEvent = {
    id: number;
    location: string;
    createdAt: Date;
    action: TAction;
    actor: TUser;
    targetUser?: TUser;
    team?: TTeam;
    incident?: TIncident;
  };
}
