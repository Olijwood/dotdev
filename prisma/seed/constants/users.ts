import { randFullName, randUserName, randEmail, randUuid } from "@ngneat/falso";

export const STATIC_USER_DATA = [
    {
        id: "1",
        name: "Alice Thompson",
        email: "alice.thompson@gmail.com",
        username: "alicet",
        password: "securepassword1",
        bio: "Frontend dev. Coffee enthusiast. Always styling something new.",
    },
    {
        id: "2",
        name: "Ben Carter",
        email: "ben.carter@example.com",
        username: "bencodes",
        password: "hashedpassword2",
        bio: "Backend engineer and API whisperer. Building stuff that scales.",
    },
    {
        id: "3",
        name: "Charlie Nguyen",
        email: "charlie.nguyen@devmail.com",
        username: "charlien_dev",
        password: "securepass3",
        bio: "Full-stack dev with a passion for clean code and bad puns.",
    },
    {
        id: "4",
        name: "Danielle Smith",
        email: "danielle.smith@devmail.com",
        username: "dani.codes",
        password: "securepass4",
        bio: "DevRel @ heart. I write, speak, and meme about code.",
    },
    {
        id: "5",
        name: "Ethan Williams",
        email: "ethan.williams@gmail.com",
        username: "ethanw",
        password: "strongpass5",
        bio: "Software engineer. Night owl. Forever learning.",
    },
];

export const generateMockUser = (overrides = {}) => ({
    id: randUuid(),
    name: randFullName(),
    username: randUserName(),
    email: randEmail(),

    image: "hacker.png",
    ...overrides,
});

export const generateMockUsers = (count = 15, overrides = {}) =>
    Array.from({ length: count }, () => generateMockUser(overrides));

export const USER_DATA = [...STATIC_USER_DATA, ...generateMockUsers(15)];
