import {
    randFullName,
    randUserName,
    randEmail,
    randAvatar,
    randUuid,
} from "@ngneat/falso";

export const STATIC_USER_DATA = [
    {
        id: "1",
        name: "Alice Thompson",
        email: "alice.thompson@gmail.com",
        username: "alicet",
        password: "securepassword1",
    },
    {
        id: "2",
        name: "Ben Carter",
        email: "ben.carter@example.com",
        username: "bencodes",
        password: "hashedpassword2",
    },
    {
        id: "3",
        name: "Charlie Nguyen",
        email: "charlie.nguyen@devmail.com",
        username: "charlien_dev",
        password: "securepass3",
    },
    {
        id: "4",
        name: "Danielle Smith",
        email: "danielle.smith@devmail.com",
        username: "dani.codes",
        password: "securepass4",
    },
    {
        id: "5",
        name: "Ethan Williams",
        email: "ethan.williams@gmail.com",
        username: "ethanw",
        password: "strongpass5",
    },
];

export const generateMockUser = (overrides = {}) => ({
    id: randUuid(),
    name: randFullName(),
    username: randUserName(),
    email: randEmail(),
    image: randAvatar(),
    ...overrides,
});

export const generateMockUsers = (count = 15, overrides = {}) =>
    Array.from({ length: count }, () => generateMockUser(overrides));

export const USER_DATA = [...STATIC_USER_DATA, ...generateMockUsers(15)];
