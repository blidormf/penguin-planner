import "./styles/global.css";
import "./styles/home.css";
import Project from "./modules/project";
import { 
    Task, 
    PRIORITY 
} from "./modules/task";
import { 
    renderProjects, 
    renderTasks, 
    clearTasks, 
    clearProjects, 
    addTaskDiv, 
    addProjectDiv,
    showTodayTasks,
    showWeekTasks,
    showAllTasks 
} from "./modules/ui";
import { saveProjects, loadProjects } from "./modules/storage";

const projects = loadProjects();

let currProject = null;
const setCurrentProject = (project) => {
    currProject = project;
};

renderProjects(projects, setCurrentProject);

const addTaskDialog = document.querySelector("dialog.add-task-dialog");
const addTaskForm = document.querySelector("dialog.add-task-dialog form");
const addTaskButton = document.querySelector("button.add-task-button");
const addProjectDialog = document.querySelector("dialog.add-project-dialog");
const addProjectButton = document.querySelector("button.add-project-button");
const addProjectForm = document.querySelector("dialog.add-project-dialog form");
const addTaskCancelButton = document.querySelector("dialog.add-task-dialog #cancel-dialog-button");
const addProjectCancelButton = document.querySelector("dialog.add-project-dialog #cancel-dialog-button");

// Add task form content
const taskTitle = document.querySelector("dialog.add-task-dialog input#title");
const taskDesc = document.querySelector("dialog.add-task-dialog input#desc");
const taskDueDate = document.querySelector("dialog.add-task-dialog input#due-date");
const taskPriorityHigh = document.querySelector("dialog.add-task-dialog input#high");
const taskPriorityNormal = document.querySelector("dialog.add-task-dialog input#normal");
const taskPriorityLow = document.querySelector("dialog.add-task-dialog input#low");

// Add project form content
const projectTitle = document.querySelector("dialog.add-project-dialog input#title");
const projectDesc = document.querySelector("dialog.add-project-dialog input#desc");

// Event listeners
addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const priority = taskPriorityHigh.checked ? PRIORITY.HIGH : taskPriorityNormal.checked ? PRIORITY.NORMAL : PRIORITY.LOW;

    const newTask = new Task(taskTitle.value, new Date(taskDueDate.value), priority, taskDesc.value);
    currProject.addTask(newTask);

    taskTitle.value = "";
    taskDesc.value = "";
    taskDueDate.value = "";
    taskPriorityHigh.checked = true;
    taskPriorityNormal.checked = false;
    taskPriorityLow.checked = false;

    addTaskDialog.close();
    addTaskDiv(newTask);
    saveProjects(projects);
});

addProjectButton.addEventListener('click', () => {
    addProjectDialog.showModal();
});

addProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProject = new Project(projectTitle.value, projectDesc.value);
    projects.push(newProject);

    projectTitle.value = "";
    projectDesc.value = "";

    addProjectDialog.close();
    const newProjectDom = addProjectDiv(newProject, projects);

    newProjectDom.addEventListener('click', () => {
        const projectList = document.querySelectorAll("p.heading");

        for (const project of projectList) {
            project.classList.remove("selected");
        }

        newProjectDom.classList.add("selected");
        clearTasks();
        setCurrentProject(newProject);
        renderTasks(newProject);
        saveProjects(projects);
    });
});

addTaskCancelButton.addEventListener('click', (e) => {
    e.preventDefault();

    taskTitle.value = "";
    taskDesc.value = "";
    taskDueDate.value = "";
    taskPriorityHigh.checked = true;
    taskPriorityNormal.checked = false;
    taskPriorityLow.checked = false;

    addTaskDialog.close();
});

addProjectCancelButton.addEventListener('click', (e) => {
    e.preventDefault();

    projectTitle.value = "";
    projectDesc.value = "";

    addProjectDialog.close();
});

const todayAction = document.querySelector(".sidebar-action:nth-child(1)");
const weekAction = document.querySelector(".sidebar-action:nth-child(2)");
const allAction = document.querySelector(".sidebar-action:nth-child(3)");

todayAction.addEventListener('click', () => {
    clearTasks();
    showTodayTasks(projects);
});

weekAction.addEventListener('click', () => {
    clearTasks();
    showWeekTasks(projects);
});

allAction.addEventListener('click', () => {
    clearTasks();
    showAllTasks(projects);
});