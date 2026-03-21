import { useState, lazy, Suspense } from "react";
import { dashboardTasks } from "../../data/mock-data";
import { TaskListPanel } from "../../components/dashboard/TaskListPanel";
import { TaskDetailPanel } from "../../components/dashboard/TaskDetailPanel";
import { InlineLoader } from "../../components/common/PageLoader";

const NewTaskView = lazy(() =>
  import("../../components/dashboard/NewTaskView").then((m) => ({ default: m.NewTaskView })),
);

export function TasksPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(dashboardTasks[0].id);
  const [showNewTask, setShowNewTask] = useState(false);
  const selectedTask = dashboardTasks.find((t) => t.id === selectedTaskId)!;

  if (showNewTask) {
    return (
      <Suspense fallback={<InlineLoader />}>
        <NewTaskView onBack={() => setShowNewTask(false)} />
      </Suspense>
    );
  }

  return (
    <>
      <TaskListPanel
        tasks={dashboardTasks}
        selectedTaskId={selectedTaskId}
        onSelectTask={setSelectedTaskId}
        onNewTask={() => setShowNewTask(true)}
      />
      <TaskDetailPanel task={selectedTask} />
    </>
  );
}
