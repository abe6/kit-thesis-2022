# The Keep In Touch System

This repository contains the code for my 2022 honours thesis. The Keep In Touch system is a cross platform (IOS, Android) react native application built using the Expo framework and connects to a firebase backend. To run this code:

1. Install Expo. You'll need:
    * To have NPM installed on your system
    * The [Expo CLI](https://docs.expo.dev/get-started/installation/)
    * An IOS or Android device with the Expo Go app installed 
    * **OR** 
    * An IOS or Android emulator
1. Set up a Firebase web project. Your project needs:
    * Email & password authentication
    * Firestore database
    * Storage
1. Copy the Firebase [config file](https://support.google.com/firebase/answer/7015592?hl=en#zippy=%2Cin-this-article) and place it in `/firebase/firebase-config.tsx`
1. Install dependencied by executing `npm install`
1. Run the application using the Expo CLI `expo start`
1. Connect your emulator, or connect a real device using the Expo Go app.