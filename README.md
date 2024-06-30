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

OR download the apk file to your device

We did not publish the application to appstore/playstore so it is going to be an apk file. 

For Android users: click the link below and install the apk

https://expo.dev/accounts/tansanchian/projects/planpocket/builds/271e3398-d213-45c4-b107-7d8d8797dd2d

For IOS users: since ios doesn't allow third party apk, you would need to run the app on the device emulator on your laptop.

(Only use laptop when you are IOS user)

For windows users: Click the link below and click the three dots, select Download Build.

https://expo.dev/accounts/tansanchian/projects/planpocket/builds/271e3398-d213-45c4-b107-7d8d8797dd2d

Install android studio (https://developer.android.com/studio) and launch the andorid emulator. Then, drag the apk file into the emulator.

For macos users: Click the link below and download the zipped file. 

https://expo.dev/accounts/tansanchian/projects/planpocket/builds/a8ed890d-3d15-4594-9eac-a6d0469cdbc1

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

<h3>May (Milestone 1)</h3>

<b><u>User Account Authentication [Completed]</u></b>

<b>Login via email and password:</b>

Based on user input, the application will invoke Firebase authentication. For instance, when registering with an email and password, the onRegisterPressed method will be called. Any FirebaseAuthException that arises will be handled within a try-catch block, along with react-hook-form, to ensure that the user does not enter invalid data. For example, the password must be at least six characters long, the confirmation password must match the original password, and the email address must conform to the standard email format.

Only then upon successful creation of the account will the user be auto routed to the login page to login to access our home screen.

React-native navigation stack is used to ensure smooth user experience.

<b>Implementation side features:</b>

The application includes a feature to verify if the user is currently logged in. When the user first opens the application, it checks the user's login status. If the user is logged in, the application directs them to the home page. Otherwise, it prompts the user to log in.
<img width="643" alt="image" src="https://github.com/tansanchian/PlanPocket/assets/142957529/f7a991e4-5b17-4100-b756-49c225baba3b">

<img width="638" alt="image" src="https://github.com/tansanchian/PlanPocket/assets/142957529/095c4325-b7e9-49a8-be75-431e37f95a39">
<img width="639" alt="image" src="https://github.com/tansanchian/PlanPocket/assets/142957529/c0433165-0696-4bd8-b71a-ed05accaded2">

<u><b>Profile Feature [Completed]</u></b>

<img width="198" alt="image" src="https://github.com/tansanchian/PlanPocket/assets/142957529/cbef8a5b-803f-475b-b93f-e636f9600ae0">


<img width="190" alt="image" src="https://github.com/tansanchian/PlanPocket/assets/142957529/4c8db542-a397-4c38-8e6b-684d4b7d3477">

<b>User Information Management:</b>
Users can update their username, phone number, location, and email address. Data validation ensures that inputs such as email and phone number are correctly formatted and required fields are not left empty.

<b>Profile Image Management:</b>
Users can upload a profile picture using their camera or choose from their photo gallery. Images are uploaded to Firebase Storage and the URL is stored in the user's profile. Users can remove their profile picture if they choose to do so.

<b>Security and Authentication:</b>
Reauthentication is required for sensitive operations such as changing the email address. Utilizes Firebase authentication for secure user management. Error handling for re authentication ensures users are informed of any issues with their password.

<b>Data Persistence:</b>
Profile data is read from and written to a database using custom writeProfile and readProfile functions. Ensures data consistency and reliability with proper error handling during read/write operations. 

<b>UX/UI design:</b>
The profile screen is designed with a modern and clean UI, providing a seamless user experience. Editable fields are clearly distinguished from non-editable ones, and users are given visual feedback during the editing process. A modal interface is used for profile image options and password reauthentication, enhancing the usability and aesthetic appeal of the application.

<h3>June (Milestone 2)</h3>

<u><b>Advanced UX/UI and Overall Layout Improvement [Completed]</b></u>

<b>Color Scheme Update:</b> 
Implemented a modern, accessible color palette to improve visual appeal and readability.

<b>Layout Restructuring:</b>
Redesigned the application’s layout to enhance user navigation and interaction, ensuring a more intuitive and seamless user experience.

<b>Compatibility Enhancements:</b>
Updated the application to be more compatible with various devices and screen sizes, ensuring a consistent experience across platforms.

<b>Cohesion and Design Improvements:</b>
Ensured all elements of the application follow a cohesive design language, improving the overall aesthetic and functional quality.

<p style={text-decoration: underline}><b>Timetable Management Feature [Completed]</b></p>

<b>Calendar and Agenda Integration:</b>
<img width="240" alt="image" src="https://github.com/tansanchian/PlanPocket/assets/142957529/ecb61f21-e20c-4ba3-8802-b473c1fe8a93">

Utilizes react-native-calendars to provide a combined calendar and agenda view. Users can view their schedules in a daily, weekly, or monthly format.

<b>Dynamic Data Loading:</b>
Schedules are dynamically loaded based on the current date and user interaction. Efficiently handles large data sets and ensures smooth scrolling and data rendering.

<b>Interactive Schedule Management:</b>
Users can tap on a schedule item to navigate to a detailed view, allowing for edits and updates. Empty dates are displayed with a placeholder message, enhancing user experience.

<b>Custom Styling and Theming:</b>
The calendar and agenda components are styled to match the application's design language. Custom themes ensure visual consistency and improve user interface aesthetics.

<b>Data Persistence</b>
Schedule data is read from and written to a database using custom functions like readScheduleDatabase. Ensures data integrity and reliability with proper error handling during data operations.

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

