import { format, addDays, formatDistanceStrict } from 'date-fns';
import Project from './project';
import Task from './task';
import Storage from './storage';

let taskIdCounter = 0;

export default function Todolist() {
  const inbox = new Project('Inbox', 'blueviolet');
  const today = new Project('Today');
  const nextWeek = new Project('Next 7 days');
  const logbook = new Project('Logbook');

  const storage = Storage();
  const projects = storage.getItem('projects') || [
    inbox,
    today,
    nextWeek,
    logbook,
  ];

  // getters
  function getAllTasks() {
    return logbook.getTasks();
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
    logbook.addTask(task);
    taskIdCounter += 1;
    storage.saveItem('project', projects);
    return 1;
  }

  function editProject(project, newProjectTitle, newProjectColor = '') {
    if (
      getProjectTitles()
        .filter((title) => title !== project.title)
        .includes(newProjectTitle)
    ) {
      return 0;
    }
    if (!newProjectTitle) {
      return -1;
    }
    project.edit({ title: newProjectTitle, color: newProjectColor });
    storage.saveItem('project', projects);
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
    }
    storage.saveItem('project', projects);
    return 1;
  }

  function removeTask(task) {
    const project = getProjectByTitle(task.project);
    project.removeTask(task);
    logbook.removeTask(task);
    storage.saveItem('project', projects);
  }

  function removeProject(project) {
    project.getTasks().forEach((task) => {
      removeTask(task);
    });
    projects.splice(projects.indexOf(project), 1);
    storage.saveItem('project', projects);
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
    removeAllDoneTasks,
  };
}
