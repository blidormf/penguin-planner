import { format } from "date-fns";
import { isToday, isThisWeek, parseISO } from 'date-fns';

export const renderProjects = (projects, setCurrentProject) => {
    const sidebarProjectsDiv = document.querySelector("div.sidebar-projects");
    const addProjectDiv = document.createElement("div");
    const addProjectButton = document.createElement("button");
    const addProjectLabel = document.createElement("p");

    addProjectDiv.className = "add-project";
    addProjectButton.className = "add-project-button";

    addProjectButton.textContent = "+";
    addProjectLabel.textContent = "Add Project";

    addProjectDiv.appendChild(addProjectButton);
    addProjectDiv.appendChild(addProjectLabel);

    for (const project of projects) {
        const projectHeading = document.createElement("p");
        const deleteButton = document.createElement("button");

        projectHeading.className = "heading";
        deleteButton.className = "delete-button";

        projectHeading.textContent = project.title;
        deleteButton.textContent = "×";

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = projects.indexOf(project);
            if (index > -1) {
                projects.splice(index, 1);
                sidebarProjectsDiv.removeChild(projectHeading);
                clearTasks();
            }
        });

        projectHeading.addEventListener('click', () => {
            const projectList = document.querySelectorAll("p.heading");
            for (const p of projectList) {
                p.classList.remove("selected");
            }
            projectHeading.classList.add("selected");
            clearTasks();
            setCurrentProject(project);
            renderTasks(project);
        });
        
        projectHeading.appendChild(deleteButton);
        sidebarProjectsDiv.appendChild(projectHeading);
    }

    sidebarProjectsDiv.appendChild(addProjectDiv);
};

const createTaskElement = (task, projectDiv) => {
    const taskElement = document.createElement("div");
    const divLeft = document.createElement("div");
    const divRight = document.createElement("div");
    const checkbox = document.createElement("div");
    const taskTitle = document.createElement("p");
    const date = document.createElement("p");
    const deleteButton = document.createElement("button");

    taskElement.className = task.complete ? "completed-task" : "task";
    divLeft.className = "left";
    divRight.className = "right";
    checkbox.className = "checkbox";
    taskTitle.className = "title";
    date.className = "date";
    deleteButton.className = "delete-button";

    taskTitle.textContent = task.title;
    checkbox.textContent = task.complete ? "✓" : "";
    date.textContent = task.complete ? "Completed" : "Due: " + format(task.dueDate, "dd MMM yyyy");
    deleteButton.textContent = "×";

    switch (task.priority) {
        case "low":
            checkbox.classList.add("low-priority");
            break;
        case "normal":
            checkbox.classList.add("normal-priority");
            break;
        case "high":
            checkbox.classList.add("high-priority");
            break;
        default:
            break;
    }

    checkbox.addEventListener("click", () => {
        task.toggleComplete();
        taskElement.className = task.complete ? "completed-task" : "task";
        checkbox.textContent = task.complete ? "✓" : "";
        date.textContent = task.complete ? "Completed" : "Due: " + format(task.dueDate, "dd MMM yyyy");
        
        saveProjects(task.project.tasks.map(t => t.project));
    });

    deleteButton.addEventListener("click", () => {
        const projectTasks = task.project.tasks;
        const index = projectTasks.indexOf(task);
        if (index > -1) {
            projectTasks.splice(index, 1);
            projectDiv.removeChild(taskElement);
        }
    });

    divLeft.appendChild(checkbox);
    divLeft.appendChild(taskTitle);
    divRight.appendChild(date);
    divRight.appendChild(deleteButton);
    taskElement.appendChild(divLeft);
    taskElement.appendChild(divRight);
    
    return taskElement;
};

export const renderTasks = (project) => {
    const mainContent = document.querySelector("div.main-content");
    const projectDiv = document.createElement("div");
    const projectTitle = document.createElement("p");
    const addTaskDiv = document.createElement("div");
    const addTaskButton = document.createElement("button");
    const addTaskLabel = document.createElement("p");

    projectDiv.className = "project";
    projectTitle.className = "heading";
    projectTitle.textContent = project.title;
    addTaskDiv.className = "add-task";
    addTaskButton.className = "add-task-button";

    addTaskButton.textContent = "+";
    addTaskLabel.textContent = "Add Task";

    addTaskDiv.appendChild(addTaskButton);
    addTaskDiv.appendChild(addTaskLabel);
    projectDiv.appendChild(projectTitle);


    for (const task of project.tasks) {
        const taskElement = createTaskElement(task, projectDiv);
        projectDiv.appendChild(taskElement);
    }

    projectDiv.appendChild(addTaskDiv);

    addTaskDiv.addEventListener("click", () => {
        const addTaskDialog = document.querySelector("dialog.add-task-dialog");
        addTaskDialog.showModal();
    });

    mainContent.appendChild(projectDiv);
};

export const addTaskDiv = (task) => {
    const projectDiv = document.querySelector("div.project");
    const taskElement = createTaskElement(task, projectDiv);
    projectDiv.insertBefore(taskElement, projectDiv.lastChild);
};

export const addProjectDiv = (project, projects) => {
    const sidebarProjectsDiv = document.querySelector("div.sidebar-projects");
    const projectHeading = document.createElement("p");
    const deleteButton = document.createElement("button");

    projectHeading.className = "heading";
    deleteButton.className = "delete-button";

    projectHeading.textContent = project.title;
    deleteButton.textContent = "×";

    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = projects.indexOf(project);
        if (index > -1) {
            projects.splice(index, 1);
            sidebarProjectsDiv.removeChild(projectHeading);
            clearTasks();
        }
    });

    projectHeading.appendChild(deleteButton);
    sidebarProjectsDiv.insertBefore(projectHeading, sidebarProjectsDiv.lastChild);
    
    return projectHeading;
}

export const clearTasks = () => {
    const mainContent = document.querySelector("div.main-content");
    const projectDiv = document.querySelector("div.project");

    if (projectDiv === null) {
        return;
    }

    mainContent.removeChild(projectDiv);
}

export const clearProjects = () => {
    const sidebarProjectsDiv = document.querySelector("div.sidebar-projects");
    while (sidebarProjectsDiv.firstChild && sidebarProjectsDiv.firstChild.classList.contains("heading")) {
        sidebarProjectsDiv.removeChild(sidebarProjectsDiv.firstChild);
    }
};

export const renderFilteredTasks = (title, tasks) => {
    const mainContent = document.querySelector("div.main-content");
    const projectDiv = document.createElement("div");
    const projectTitle = document.createElement("p");

    projectDiv.className = "project";
    projectTitle.className = "heading";
    projectTitle.textContent = title;
    projectDiv.appendChild(projectTitle);

    for (const task of tasks) {
        const taskElement = createTaskElement(task, projectDiv);
        projectDiv.appendChild(taskElement);
    }

    mainContent.appendChild(projectDiv);
};

export const showTodayTasks = (projects) => {
    const todayTasks = projects.flatMap(project => 
        project.tasks.filter(task => !task.complete && isToday(task.dueDate))
    );
    renderFilteredTasks("Today's Tasks", todayTasks);
};

export const showWeekTasks = (projects) => {
    const weekTasks = projects.flatMap(project => 
        project.tasks.filter(task => !task.complete && isThisWeek(task.dueDate))
    );
    renderFilteredTasks("This Week's Tasks", weekTasks);
};

export const showAllTasks = (projects) => {
    const allTasks = projects.flatMap(project => project.tasks);
    renderFilteredTasks("All Tasks", allTasks);
};