export const customer = () => {
  return [
    {
      start: new Date(2023, 3, 1),
      end: new Date(2023, 3, 30),
      name: 'Sopimus 2023',
      id: 'task-1',
      progress: 0,
      dependencies: [],
      type: '',
      project: '',
      displayOrder: 1,
    },
    {
      start: new Date(2023, 3, 9),
      end: new Date(2023, 3, 30),
      name: 'Kaavoitus. Emätila trigger rantavyöhykkeen hyödyntäminen',
      id: 'task-2',
      progress: 100,
      dependencies: [],
      type: 'task',
      project: 'Sopimus_2023',
      displayOrder: 2,
    },
  ];
};
