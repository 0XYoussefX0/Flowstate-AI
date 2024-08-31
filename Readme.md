# Flowstate AI : Your AI coach to stay focused in this digital age.

## What is Flowstate AI

Flowstate AI is an extension that helps you stay focused while surfing YouTube. It works by giving you the option to remove shorts from appearing, and even if you click on one through a link, you won't be able to watch it. Additionally, it blocks content that is irrelevant to what you intended to watch before getting distracted by the YouTube algorithm. For example, if you want to learn about software engineering, you can specify this in the extension. It then analyzes the transcript of the video you are watching, sends it to an AI model fine-tuned for this task, and determines whether the content is relevant. If it’s not, a modal will appear with a message from the AI stating that you are not allowed to watch that type of content. Note that the extension doesn't work if the YouTube video has no subtitles, though it does support auto-generated ones.

![Demo-e](https://github.com/0XYoussefX0/Flowstate-AI/assets/151054138/48ed9533-7a50-453d-a549-8c480e638f93)

## Project Structure

```
project_root
│
├── assets
│ ├── editIcon.svg
│ ├── icon.png
│ ├── runningIcon.png
│ └── warningIcon.svg
│
├── fonts
│ ├── inter-v13-latin-500.woff2
│ ├── inter-v13-latin-600.woff2
│ └── inter-v13-latin-regular.woff2
│
├── server
│ ├── app.py
│ └── load_creds.py
│
├── .gitignore
├── background.ts
├── global.css
├── popup.html
├── manifest.json
├── modalStyles.css
├── output.css
├── package.json
├── package-lock.json
├── popup.ts
├── README.md
├── script.ts
├── tailwind.config.js
└── tsconfig.json
```

## Files and Folders Description

- `assets`: Folder that holds all of the images used inside the project.
- `fonts`: Folder that holds all of the fonts used inside the project.
- `server`: Folder that holds the backend code.
- `app.py`: Python file containing backend code that handles requests comming from the frontend, at the moment it only has one route called "/verdict" that returns whether the user of the extention is allowed to watch some piece of content or not, it uses an ai model that i've tuned alongside other libraries to do that.
- `load_creds.py`: Python file containing a function that handles OAuth, i'm using it to get access to the ai model that i've tuned.
- `.gitignore`: file containing the files and folders that git should ignore.
- `background.ts`: Typescript file that has the code that keeps running in the background when chrome (or probably any chromium) browser is opened, this file communicates with the content script through the chrome api, sending a message when the user navigates to a different page, or when the user visits a youtube video, it also prevents the user from accessing shorts if the user has turned that on.
- `global.css`: CSS file containing some tailwind configuration as well as some styles used in the popup.html.
- `manifest.json`: JSON file containing the extention config.
- `modalStyles.css`: CSS file that gets injected to the webpage and it contains styles for the modal.
- `output.css`: CSS file outputed by tailwind and it contains styles for the popup.html.
- `package.json`: npm package configuration file specifying project dependencies and metadata.
- `package-lock.json`: npm package lock file to provide version consistency across installations.
- `popup.html`: HTML file containing the html of the extention popup.
- `popup.ts`: TypeScript file containing typescript code for the extention popup, it adds interactivity to the extention.
- `README.md`: Markdown file that explain the project.
- `script.ts`: TypeScript file containing the content script that gets injected to the webpage that the extention is running in, this file has a bunch of functions that make sure that shorts are removed if the user opted in to that, it's also responsible for making a request to the backend and showing a modal if the response from the backend is that the user is not allowed to watch that content.
- `tailwind.config.js`: Javascript file containing Tailwind CSS configuration.
- `tsconfig.json`: JSON file that contains Typescript configuration.

## Why did i build this extention ?

I built this extention because this project solves a problem that i was suffering from, i used to spend a lot of time watching youtube shorts and watching content that is not relevant to the goals that i want to achieve, so i thought about making an extention that solves my problem, and after doing a bit of research i found out that a lot of people have the same problem, some of them run away from tiktok to youtube, just to find out that youtube also serves short form content, and they don't want to quit youtube as well because they probably watch educational content in there or for some other reason, so i think this extention will help us staying focused, productive and intentional about our use of youtube.
