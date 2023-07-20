export default class Task {
  constructor({ 
    name, 
    status = 'todo', 
    due, 
    project = 'Inbox', 
    priority = 0, 
    note = ''
  }) {
    this.name = name;
    this.status = status;
    this.due = due;
    this.project = project;
    this.priority = priority;
    this.note = note;
  }
  
  edit({ ...args }) {
    for (const [key, value] of Object.entries({ ...args })) {
      if (key === 'name') {
        const oldName = this.name;
        console.log(`${key} of '${oldName}' updated to '${value}'`);
      } else {
        console.log(`${key} of '${this.name}' updated to '${value}'`);
      }
      this[key] = value;
    }
  }
}