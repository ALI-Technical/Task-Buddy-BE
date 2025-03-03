// cron/taskReminder.ts
import cron from "node-cron";
import Task from "../Models/Task";
import { io } from "../Config/socket";

// Function to start the cron job
export const startTaskReminderCronJob = () => {
  // Schedule the job to run every day at 2:00 PM server time.
  cron.schedule("0 14 * * *", async () => {
    console.log(
      `Running task reminder cron job at ${new Date().toTimeString()}...`
    );
    try {
      // Calculate the timestamp for 24 hours ago
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      // Query for tasks that are incomplete and created before (or at) twentyFourHoursAgo
      const tasks = await Task.find({
        completed: false,
        createdAt: { $lte: twentyFourHoursAgo },
      });

      if (tasks.length > 0) {
        // console.log("Reminder: Incomplete tasks older than 24 hours:");
        await Task.updateMany(
          { _id: { $in: tasks.map((task) => task._id) } },
          { $set: { reminder: true } }
        );
        io.emit("taskReminder", {
          message: `You haven't completed these Tasks`,
          tasks,
        });
      } else {
        console.log("No incomplete tasks older than 24 hours.");
      }
    } catch (error) {
      console.error("Error running task reminder cron job:", error);
    }
  });
};
