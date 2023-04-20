import { Gantt } from 'gantt-task-react';
import * as React from 'react';

export function getStartEndDateForProject(tasks, projectId) {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}

export const GanttWithHeader = ({
  header,
  tasks,
  view,
  columnWidth,
  setCurProject,
  setTasks,
  isChecked,
}) => {
  const [scroll, setScroll] = React.useState(225);

  const handleTaskChange = (task) => {
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task) => {
    const conf = window.confirm('Are you sure about ' + task.name + ' ?');
    if (conf) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task) => {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t));

    const newProject = handleProjectProgress(newTasks, task.project);

    setTasks(newProject);
  };

  const handleDblClick = (task) => {
    const change = window.prompt("Change '" + task.name + "' to:");
    if (change) {
      task.name = change;
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    }
  };

  const handleSelect = (task, isSelected) => {
    if (task.type === 'project') {
      let projectTasks = tasks.filter((t) => t.project === task.id);
      projectTasks.unshift(task);
      setCurProject(isSelected ? projectTasks : []);
    }
  };

  const handleExpanderClick = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  const handleProjectProgress = (newTasks, project) => {
    const filteredTasks = newTasks.filter((t) => {
      return t.type === 'task' && t.project === project;
    });
    const avgProg =
      filteredTasks.reduce((r, c) => r + c.progress, 0) / filteredTasks.length;

    let filteredProject = newTasks.filter((t) => {
      return t.id === project;
    });
    filteredProject[0].progress = avgProg;

    const newTasksWithProject = newTasks.map((t) =>
      t.id === filteredProject[0].id ? filteredProject[0] : t
    );

    return newTasksWithProject;
  };

  return (
    <div style={{ overflowY: 'scroll' }}>
      <h3>{header}</h3>
      <Gantt
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={''}
        ganttHeight={500}
        columnWidth={scroll}
      />
    </div>
  );
};
