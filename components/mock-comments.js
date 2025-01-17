/* 
displayName
"Hello World"
photoURL
"/hacker.png"

username
"helloworld23"
displayName
"Oliver Wood"

photoURL
"https://lh3.googleusercontent.com/a/ACg8ocLz8BfOf1tjWSY09xutWufJ0bFwctc1PuvHdoWdzzDHoKTkww=s96-c"
username
"olijwood"

displayName
"WigsBySeph"

photoURL
"https://lh3.googleusercontent.com/a/ACg8ocKjMoltLROoTI8gHl1cQy18fdbdNAE7pRnSYWMYvN-ywWRzPA=s96-c"

username
"wigbyseph"

*/

export const mockComments = [
  {
    id: "1",
    content: "This is a great article!",
    createdAt: "2024-01-17T12:00:00Z",
    likes: 5,
    user: {
      displayName: "Hello World",
      photoURL: "/hacker.png",
    },
    replies: [
      {
        id: "1_1",
        content: "I completely agree!",
        createdAt: "2024-01-17T12:10:00Z",
        likes: 2,
        user: {
          displayName: "Oliver Wood",
          photoURL:
            "https://lh3.googleusercontent.com/a/ACg8ocLz8BfOf1tjWSY09xutWufJ0bFwctc1PuvHdoWdzzDHoKTkww=s96-c",
        },
        replies: [],
        isReply: true,
      },
      {
        id: "1_2",
        content: "I disagree.",
        createdAt: "2024-01-17T12:20:00Z",
        likes: 1,
        user: {
          displayName: "WigsBySeph",
          photoURL:
            "https://lh3.googleusercontent.com/a/ACg8ocKjMoltLROoTI8gHl1cQy18fdbdNAE7pRnSYWMYvN-ywWRzPA=s96-c",
        },
        replies: [],
        isReply: true,
      },
    ],
  },
  {
    id: "2",
    content: "This is a great article!",
    createdAt: "2024-01-17T12:00:00Z",
    likes: 5,
    user: {
      displayName: "Oliver Wood",
      photoURL:
        "https://lh3.googleusercontent.com/a/ACg8ocLz8BfOf1tjWSY09xutWufJ0bFwctc1PuvHdoWdzzDHoKTkww=s96-c",
    },
    replies: [],
  },
  {
    id: "3",
    content: "I loved this article.",
    createdAt: "2024-01-17T12:00:00Z",
    likes: 8,
    user: {
      displayName: "WigsBySeph",
      photoURL:
        "https://lh3.googleusercontent.com/a/ACg8ocKjMoltLROoTI8gHl1cQy18fdbdNAE7pRnSYWMYvN-ywWRzPA=s96-c",
    },
    replies: [
      {
        id: "3_1",
        content: "I did too!",
        createdAt: "2024-01-17T12:10:00Z",
        likes: 2,
        user: {
          displayName: "Hello World",
          photoURL: "/hacker.png",
        },
        replies: [],
        isReply: true,
      },
      {
        id: "3_2",
        content: "I did not.",
        createdAt: "2024-01-17T12:20:00Z",
        likes: 1,
        user: {
          displayName: "Oliver Wood",
          photoURL:
            "https://lh3.googleusercontent.com/a/ACg8ocLz8BfOf1tjWSY09xutWufJ0bFwctc1PuvHdoWdzzDHoKTkww=s96-c",
        },
        replies: [],
        isReply: true,
      },
    ],
  },
  {
    id: "4",
    content: "I loved this article.",
    createdAt: "2024-01-17T12:00:00Z",
    likes: 8,
    user: {
      displayName: "Hello World",
      photoURL: "/hacker.png",
    },
    replies: [
      {
        id: "4_1",
        content: "I did too!",
        createdAt: "2024-01-17T12:10:00Z",
        likes: 2,
        user: {
          displayName: "WigsBySeph",
          photoURL:
            "https://lh3.googleusercontent.com/a/ACg8ocKjMoltLROoTI8gHl1cQy18fdbdNAE7pRnSYWMYvN-ywWRzPA=s96-c",
        },
        replies: [],
        isReply: true,
      },
      {
        id: "4_2",
        content: "I did not.",
        createdAt: "2024-01-17T12:20:00Z",
        likes: 1,
        user: {
          displayName: "Oliver Wood",
          photoURL:
            "https://lh3.googleusercontent.com/a/ACg8ocLz8BfOf1tjWSY09xutWufJ0bFwctc1PuvHdoWdzzDHoKTkww=s96-c",
        },
        replies: [],
        isReply: true,
      },
    ],
  },
];
