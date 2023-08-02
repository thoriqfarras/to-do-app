import { format, addDays, formatDistanceStrict } from 'date-fns';
import Project from './project';
import Task from './task';
import Storage from './storage';

export default function Todolist() {
  const storage = Storage();
  let taskIdCounter = 0;
  const restoredProjects = storage.getItem('projects');
  const projects = [];
  if (restoredProjects) {
    restoredProjects.forEach((project) => {
      addProject(project.title, project.color);
      project._tasks.forEach((task) => {
        if (
          project.title !== 'Today' &&
          project.title !== 'Next 7 days' &&
          project.title !== 'Logbook'
        ) {
          addTask(task);
        }
      });
    });
  } else {
    addProject('Inbox', 'blueviolet');
    addProject('Today');
    addProject('Next 7 days');
    addProject('Logbook');
    addTask({ title: 'mop the floor', priority: 2 });
    addProject('Groceries');
    addTask({ title: 'mop the garage', priority: 1, project: 'Chores' });
  }

  const today = projects[1];
  const nextWeek = projects[2];
  const logbook = projects[3];

  // getters
  function getAllTasks() {
    const allTasks = [];
    projects.forEach((project) => {
      if (
        project.title !== 'Today' &&
        project.title !== 'Next 7 days' &&
        project.title !== 'Logbook'
      )
        project.getTasks().forEach((task) => {
          allTasks.push(task);
        });
    });
    return allTasks;
  }

  function getTaskById(id) {
    const allTasks = getAllTasks();
    return allTasks.find((task) => +task.getId() === +id);
  }

  function getProjects() {
    return projects;
  }

  function getProjectTitles() {
    return projects.map((project) => project.title);
  }

  function getProjectByTitle(title) {
    return projects.find((project) => project.title === title);
  }

  // utlities
  function addProject(title, color = '') {
    if (getProjectTitles().includes(title)) {
      return 0;
    }
    if (!title) {
      return -1;
    }
    const newProject = new Project(title, color);
    projects.push(newProject);
    storage.saveItem('projects', projects);
    return 1;
  }

  function addTask(taskInfo) {
    if (!taskInfo.title) return -1;
    const task = new Task({ id: taskIdCounter, ...taskInfo });
    let targetProject = projects.find((p) => p.title === task.project);
    if (!targetProject) {
      addProject(task.project);
      targetProject = projects.at(-1);
    }
    task.projectColor = targetProject.color;
    targetProject.addTask(task);
    taskIdCounter += 1;
    storage.saveItem('projects', projects);
    return 1;
  }

  function editProject(project, { newTitle, newColor }) {
    if (
      getProjectTitles()
        .filter((title) => title !== project.title)
        .includes(newTitle)
    ) {
      return 0;
    }
    if (!newTitle && !newColor) {
      return -1;
    }
    project.edit({
      title: newTitle || project.title,
      color: newColor || project.color,
    });
    storage.saveItem('projects', projects);
    return 1;
  }

  function editTask(task, { ...args }) {
    if (!args.title) return -1;
    const oldProjectTitle = task.project;
    task.edit({ ...args });
    if (oldProjectTitle !== task.project) {
      const oldProject = getProjectByTitle(oldProjectTitle);
      const newProject = getProjectByTitle(task.project);
      newProject.addTask(task);
      oldProject.removeTask(task);
      task.edit({ projectColor: newProject.color });
    }
    storage.saveItem('projects', projects);
    return 1;
  }

  function removeTask(task) {
    const project = getProjectByTitle(task.project);
    project.removeTask(task);
    storage.saveItem('projects', projects);
  }

  function removeProject(project) {
    project.getTasks().forEach((task) => {
      removeTask(task);
    });
    projects.splice(projects.indexOf(project), 1);
    storage.saveItem('projects', projects);
  }

  function updateToday() {
    today.getTasks().forEach((task) => {
      today.removeTask(task);
    });
    const todayTasks = getAllTasks().filter(
      (task) => task.due === format(new Date(), 'yyyy-MM-dd')
    );
    todayTasks.forEach((task) => {
      today.addTask(task);
    });
  }

  function updateNextWeek() {
    nextWeek.getTasks().forEach((task) => {
      nextWeek.removeTask(task);
    });
    getAllTasks().forEach((task) => {
      if (task.due) {
        const nextWeekEnd = addDays(new Date(), 7);
        const distance = formatDistanceStrict(nextWeekEnd, new Date(task.due), {
          unit: 'day',
          addSuffix: true,
        });
        if (distance.includes('in')) {
          nextWeek.addTask(task);
        }
      }
    });
  }

  function updateLogbook() {
    logbook.getTasks().forEach((task) => {
      logbook.removeTask(task);
    });
    getAllTasks().forEach((task) => {
      logbook.addTask(task);
    });
  }

  function removeAllDoneTasks() {
    getAllTasks().forEach((task) => {
      if (task.status === 'done') {
        removeTask(task);
      }
    });
  }

  return {
    projects,
    addTask,
    editTask,
    removeTask,
    addProject,
    editProject,
    removeProject,
    getProjects,
    getProjectTitles,
    getProjectByTitle,
    getAllTasks,
    getTaskById,
    updateToday,
    updateNextWeek,
    updateLogbook,
    removeAllDoneTasks,
  };
}
