# Task Keeper Weekly Log

## Project info

This is a task-keeping application with a weekly log feature. It is designed for university students on attachment, prioritizing function and form with an elegant and minimalist design inspired by Apple.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/BruceICzw/task-keeper-weekly-log.git

# Step 2: Navigate to the project directory.
cd task-keeper-weekly-log

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To deploy this project, you can use platforms like Netlify or Vercel. Follow their documentation for deployment steps.

## How the System Works

### Daily Task Logging

1. **Add Tasks**: Students can add their daily tasks through the `DailyTaskList` component.
2. **View Tasks**: The tasks for each day are displayed in a list format.
3. **Edit/Delete Tasks**: Students can edit or delete tasks as needed.

### Weekly Log Compilation

1. **Compile Weekly Log**: At the end of each week, students can compile their daily tasks into a weekly log using the `WeeklyLog` component.
2. **View Weekly Logs**: Compiled weekly logs are displayed in a list format, sorted by date.

### Exporting the Log Book

1. **Generate Cover Page**: When exporting the log book, students will be prompted to fill in their details, including:
   - Full Name
   - Student ID
   - Institution Name and Logo
   - Company Name and Logo
2. **Export as PDF**: The system will generate a PDF document that includes the cover page and all compiled weekly logs.

### Example Usage

```tsx
import { DailyTaskList } from './components/DailyTaskList';
import { WeeklyLog } from './components/WeeklyLog';
import { LogBook } from './components/LogBook';

const App = () => {
  return (
    <div>
      <DailyTaskList date={new Date()} />
      <WeeklyLog selectedDate={new Date()} />
      <LogBook />
    </div>
  );
};

export default App;
```

### Additional Features

- **Toast Notifications**: The system uses toast notifications to inform users of actions such as task additions, deletions, and errors.
- **Responsive Design**: The application is designed to be responsive and works well on both desktop and mobile devices.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License.