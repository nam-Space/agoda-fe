import defaultAvatar from "../images/header/default-avatar.png";

export const getUserAvatar = (name) => {
    return name
        ? (`${process.env.REACT_APP_BE_URL}${name}`)
        : defaultAvatar;
};
