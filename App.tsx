import * as React from 'react';
import './style.css';
import 'gantt-task-react/dist/index.css';
import { customer } from './data/projects';
import { ViewMode } from 'gantt-task-react';
import { GanttWithHeader } from './components/GanttWithHeader';

const getMonday = (d) => {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const dateNow = getMonday(new Date());

export default function App() {
  const [view, setView] = React.useState(ViewMode.Month);
  const [tasks, setTasks] = React.useState({
    customer: customer(),
  });
  const [isChecked, setIsChecked] = React.useState(true);

  const [curProject, setCurProject] = React.useState([]);

  const [filters, setFilter] = React.useState({
    ready: '0',
    min: addDays(dateNow, -100),
    max: addDays(dateNow, 100),
  });

  const filterTasks = (task) => {
    const minStartDate = task.reduce((prev, curr) => {
      return prev.start < curr.start ? prev : curr;
    });

    const maxStartDate = task.reduce((prev, curr) => {
      return prev.start > curr.start ? prev : curr;
    });

    const emptyTask = [
      {
        id: 'none',
        name: 'none',
        start: new Date(),
        end: new Date(),
        type: 'milestone',
        progress: 0,
      },
    ];

    let filteredTasks = task;

    switch (filters.ready) {
      case '2':
        filteredTasks = filteredTasks.filter(
          (d) => d.progress > 0 && d.progress < 100
        );
        break;
      case '3':
        filteredTasks = filteredTasks.filter((d) => d.progress === 100);
        break;
      case '4':
        filteredTasks = filteredTasks.filter((d) => d.progress === 0);
        break;
      default:
        break;
    }

    filteredTasks = !filters.min
      ? filteredTasks
      : filteredTasks.filter((d) => d.start - filters.min >= 0);
    filteredTasks = !filters.max
      ? filteredTasks
      : filteredTasks.filter((d) => d.start - filters.max < 0);

    return filteredTasks.length > 0 ? filteredTasks : emptyTask;
  };

  return (
    <div>
      <GanttWithHeader
        header="Customer"
        tasks={filterTasks(tasks.customer)}
        view={view}
        columnWidth={100}
        setTasks={setTasks}
        setCurProject={setCurProject}
        isChecked={isChecked}
      />
    </div>
  );
}
