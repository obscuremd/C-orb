import { faker } from "@faker-js/faker";

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
};

export const getIconColor = (isDark: boolean) => (isDark ? "white" : "black");

export const avatarImages = [
  "https://plus.unsplash.com/premium_vector-1727953895916-9f643d7d4b94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_vector-1727953896198-d3b625b6f952?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_vector-1727955579540-80c2091d0f21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_vector-1727956885330-0b80b9df0fc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXZhdGFyfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_vector-1727955579185-ed12a1c678de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_vector-1727952230804-96c70e8fa3f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_vector-1727956885205-98f4340304bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTB8fHxlbnwwfHx8fHw%3D",
  "https://plus.unsplash.com/premium_vector-1728560971527-140ca22e3d81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_vector-1727952231521-0f7d02075043?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_vector-1728553012079-b072e22b7a4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODl8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D",
];

export const storyImages = [
  "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1670071482460-5c08776521fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1664541336896-b3d5f7dec9a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
];

export const onboardingData = [
  {
    id: 1,
    title: "C-ORB",
    description: "Find the perfect way to connect and grow with C-Orb.",
    image: require("../assets/onboardingImages/onboarding1.jpg"),
  },
  {
    id: 2,
    title: "A Community for you . . .",
    description:
      "Share ideas, get feedback, and grow with C-Orb’s friendly expert community.",
    image: require("../assets/onboardingImages/onboarding2.jpg"),
  },
  {
    id: 3,
    title: ". . . And your Buisness",
    description:
      "C-Orb is a community marketplace where sellers showcase and buyers find what they need.",
    image: require("../assets/onboardingImages/onboarding3.jpg"),
  },
];

export const generateFeedData = (count = 5) => {
  return Array.from({ length: count }).map(() => ({
    profilePicture: faker.image.avatar(),
    name: faker.internet.email(),
    username: `@${faker.internet.userName()}`,
    image: faker.image.urlPicsumPhotos(), // realistic placeholder images
    description: faker.lorem.paragraphs(1),
    likes: (Math.random() * 10).toFixed(1), // e.g., "1.2", "7.3"
  }));
};

export const FeedData = generateFeedData(10);
