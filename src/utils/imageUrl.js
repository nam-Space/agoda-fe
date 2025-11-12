import defaultAvatar from "../images/header/default-avatar.png";
import notFoundImg from "../images/error/not-found.jpg";

export const getUserAvatar = (name) => {
    return name
        ? (`${process.env.REACT_APP_BE_URL}${name}`)
        : defaultAvatar;
};

export const getImage = (name) => {
    return name
        ? (`${process.env.REACT_APP_BE_URL}${name}`)
        : notFoundImg;
};
