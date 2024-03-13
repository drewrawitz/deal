import classNamesImport from "classnames";
export const classNames = classNamesImport;

export const getAvatarUrl = (username: string) => {
  return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`;
};
