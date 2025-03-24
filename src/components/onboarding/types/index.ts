export type UserProfileDetails = {
    id: string;
    displayName: string;
    username: string;
    profileImage: string;
    bio: string;
};

export type Tag = {
    id: string;
    name: string;
    description?: string;
    postCount: number;
};

export type Person = {
    id: string;
    name: string;
    username: string;
    bio: string;
    image: string;
};
