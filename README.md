# SoundBoard App

This repository contains a SoundBoard app built using React Native and Expo. Users can create multiple soundboards, add sounds, and manage their playback. The app supports Android, iOS, and web platforms.

## Features

- Create, rename, and delete soundboards.
- Add and remove sounds from boards.
- Play and stop sounds.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [Yarn](https://yarnpkg.com/) (v1.x or later)
- [Git](https://git-scm.com/)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/soundboard-app.git
   cd soundboard-app
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Start the development server:**

   ```bash
   yarn start
   ```

4. **Run the app:**

   - **Android:** Run on Android device/emulator:

     ```bash
     yarn android
     ```

   - **iOS:** Run on iOS device/simulator:

     ```bash
     yarn ios
     ```

   - **Web:** Run on your browser:

     ```bash
     yarn web
     ```

## Build and Publish

- **Build for production:**

  ```bash
  yarn build
  ```

- **Publish to Expo:**

  ```bash
  yarn publish
  ```

## Cleaning the Project

If you need to clean the project, you can use:

```bash
yarn clean
```

This removes the `.expo` and `node_modules` folders and the `yarn.lock` file.

---

### Additional Notes

- You can also build and submit your app to the Android and iOS stores using `eas` (Expo Application Services). Example:

  ```bash
  yarn build:submit:all
  ```

---
