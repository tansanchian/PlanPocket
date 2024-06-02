<h1>PlanPocket</h1>

<h2>For Developers</h2>

make sure node.js is installed in your local device 

download link: https://nodejs.org/en

make sure you install expo go in your mobile device (available in appstore/google playstore)

clone the repository here on your local device

cd to the path where the repository is downloaded

run <b>npm install</b>

run <b>npm run</b>

for ios: scan the generated QR code using camera

for android: open expo go application and scan the generated QR code there

OR

For Android users: click the link below and install the apk

https://expo.dev/accounts/tansanchian/projects/planpocket/builds/a1bf6387-f181-4c2a-8a74-0ec8d2dd57b9

For IOS users: since ios doesn't allow third party apk, you would need to run the app on the device emulator on your laptop.

(Only use laptop when you are IOS user)

For windows users: Click the link below and click the three dots, select Download Build.

https://expo.dev/accounts/tansanchian/projects/planpocket/builds/a1bf6387-f181-4c2a-8a74-0ec8d2dd57b9

Install android studio (https://developer.android.com/studio) and launch the andorid emulator. Then, drag the apk file into the emulator.

For macos users: Click the link below and download the zipped file. 

https://expo.dev/accounts/tansanchian/projects/planpocket/builds/c81bc929-5566-44b7-9643-17d8ebda0bd6

Then, install Xcode from mac app store then run the simulator. Next, extract the zip file and drag the .app file into the simulator

<h2>Motivation</h2>

**Integrated Time and Budget Management**: Many people struggle to balance their schedules and financial budgets simultaneously. This app is created to integrate these aspects, while providing a solution that helps users plan their activities without overspending.

**Simplification of Planning Process**: Planning for various events and activities, especially when on a budget, can be complex and time-consuming. The app seeks to simplify this process by automating the generation of a feasible and budget-friendly timetable.

**Personalization and Convenience**: Recognizing that each user has unique preferences, schedules, and financial limitations, the app offers personalized planning and suggestions, making the user experience more convenient and tailored.

**Stress Reduction**: Managing deadlines, events, and financial constraints can be stressful. The app aims to reduce this stress by providing a clear, organized plan that fits within the user’s budget, giving them peace of mind.

**Improving Quality of Life**: Ultimately, the app seeks to enhance users' quality of life by enabling them to enjoy their preferred activities and events without the constant worry of financial overreach, thereby striking a balance between enjoyment and financial health.

<h2>Aim</h2>

To develop an app that allows users to input their upcoming events, activities, and budget constraints to generate a personalized timetable and event planner. The app will help users manage their time and finances effectively, ensuring they can balance their activities, such as travel, exams, deadlines, leisure activities, and dining, within their budget.

<h2>User Stories</h2>

As a student who wants to balance study time and leisure activities within a tight budget, I want to be able to input my class schedule, study sessions, leisure activities, and daily meal budget so the system can generate a weekly timetable that optimizes my time and expenses. 

As a student planning for a semester abroad while adhering to a strict budget, I want to be able to input my travel, accommodation, and living expenses into the system, so it can help me manage my finances and ensure I stay within budget throughout my study abroad period.

As a retiree interested in pursuing hobbies and social activities without overspending, I want to be able to list my hobbies, social events, and budget limits in the system, allowing it to suggest an activity schedule that maximizes my enjoyment while adhering to my budget.

As a fitness enthusiast who wants to maintain a healthy lifestyle on a budget, I want to be able to log my workout routines, dietary needs, and fitness goals in the system so it can recommend a balanced meal and exercise plan within my financial capabilities.

<h2>Project Scope</h2>

<h3>UI + Framework for the application, Authentication, Simple Features</h3>
<h4>May (Milestone 1)</h4>

Sign in with google/facebook(work in progress)

Sign Up with email

Sign In with email 

Profile Screen (allow user to change profile picture either from camera or gallery, edit username, location and store profile data in data base)

Timetable/agenda screen

Add schedule (purpose, budget, time, others linked to data base)

Deploy an apk version of the application

<h2>Tech Stack</h2>

<b>Front-end</b>: React Native for mobile apps to ensure a consistent and intuitive user experience across platforms.

<b>Back-end</b>: Node.js with Express for a scalable and efficient API, capable of handling complex scheduling and budgeting logic.

<b>Database</b>: Firebase realtime database and storage for efficient and flexible data storage.

<b>App Hosting</b>: Use eas build to deploy the app

<h2>Software Engineering</h2>

<b>UX/UI Design</b>: Focus on creating an intuitive and attractive user interface, employing user experience design best practices to ensure the app is accessible and easy to use.

<b>Comprehensive Documentation</b>: Maintain detailed documentation of the codebase, API endpoints, and system architecture to facilitate onboarding and collaboration.

<b>NoSQL Databases</b>: Choose an appropriate database system based on the application’s needs, ensuring efficient data storage, retrieval, and relationship management.

<b>GitHub</b>: Leverage GitHub for repository hosting, code reviews, and merge requests to maintain code quality and facilitate collaborative development.

<b>Task Breakdown</b>: We will create user stories to capture specific functionalities and requirements, breaking them down into manageable tasks for efficient planning and execution.

