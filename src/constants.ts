export enum Status {
  DEFAULT,
  ACTIVE,
  USER,
  COMPUTER,
}

export const CLASSNAMES: { [key: number]: string } = {
  [Status.DEFAULT]: "default",
  [Status.ACTIVE]: "active",
  [Status.USER]: "user",
  [Status.COMPUTER]: "computer",
};
