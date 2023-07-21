export default class Task {
  constructor({ 
    title, 
    status = 'todo', 
    due, 
    project = 'Inbox', 
    priority = 0, 
    note = ''
  }) {
    this.title = title;
    this.status = status;
    this.due = due;
    this.project = project;
    this.priority = priority;
    this.note = note;
  }
  
  edit({ ...args }) {
    for (const [key, value] of Object.entries({ ...args })) {
      if (key === 'title') {
        const oldTitle = this.title;
        console.log(`${key} of '${oldTitle}' updated to '${value}'`);
      } else {
        console.log(`${key} of '${this.title}' updated to '${value}'`);
      }
      this[key] = value;
    }
  }
}