export default class Task {

  constructor({ 
    id,
    title, 
    status = 'todo', 
    due, 
    project = 'Inbox', 
    projectColor = 'blueviolet',
    priority = 0, 
    note = ''
  }) {
    this._id = id;
    this.title = title;
    this.status = status;
    this.due = due;
    this.project = project;
    this.projectColor = projectColor;
    this.priority = priority;
    this.note = note;
  }
  
  edit({ ...args }) {
    for (const [key, value] of Object.entries({ ...args })) {
      this[key] = value;
    }
  }

  getId() { return this._id };
}