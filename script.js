const taskListContainer = document.querySelector("#list-container");
const form = document.querySelector("form"); 
const formInput = document.querySelector("#input-text");

loadFromStorage(); 

form.addEventListener("submit", (e) => {
  e.preventDefault(); 
  addTask(formInput.value);  
});


function addTask(text, id = new Date(), completed = false) {
  if (!text.trim()) {
    return;
  }

  // add task element
  const taskElement = document.createElement("li");
  taskElement.innerHTML = 
    `<input type="checkbox" class="item-checkbox" id="${id}">

    <label class="custom-checkbox" for="${id}">
      <svg width="1em" height="1em"><use href="#check-icon"/></svg>
    </label>

    <label class="item-text" for="${id}">${text}</label>
    
    <button class="edit-btn">
      <svg width="1em" height="1em"><use href="#edit-icon"/></svg>
    </button>

    <button class="delete-btn">
      <svg width="1em" height="1em"><use href="#delete-icon"/></svg>
    </button>`; 
  
  taskListContainer.appendChild(taskElement); 
  formInput.value = ""; 

  // edit button
  const editButton = taskElement.querySelector(".edit-btn"); 
  editButton.addEventListener("click", () => {
    formInput.value = taskElement.querySelector(".item-text").textContent;  
    taskElement.remove(); 
    updateProgress(); 
    saveToStorage(); 
  });

  // delete button
  const deleteButton = taskElement.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () => {
    taskElement.remove(); 
    updateProgress(); 
    saveToStorage(); 
  }); 

  // checkbox
  const checkbox = taskElement.querySelector(".item-checkbox"); 
  checkbox.addEventListener("change", () => {
    editButton.disabled = checkbox.checked ?  true : false; 
    updateProgress(); 
    saveToStorage(); 
  }); 


  if (completed) {
    checkbox.checked = true; 
  }

  updateProgress(); 
  saveToStorage(); 
}; 


function saveToStorage() {
  const taskList = []; 

  for (const taskElement of taskListContainer.children) {
    const taskID = taskElement.querySelector(".item-checkbox").id; 
    const task = taskElement.querySelector(".item-text").textContent; 
    const completed = taskElement.querySelector(".item-checkbox").checked; 

    taskList.push({"task": task, "completed": completed, "id": taskID}); 
  }

  localStorage.setItem("todolist", JSON.stringify(taskList)); 
}


function loadFromStorage() {
  const taskList = JSON.parse(localStorage.getItem("todolist")) || []; 

  for (const task of taskList) {
    addTask(task.task, task.id, task.completed); 
  }
}


function updateProgress() {
  const total = taskListContainer.childElementCount; 
  const checkedCount = taskListContainer.querySelectorAll(".item-checkbox:checked").length; 
  const percentage = (checkedCount / total) * 100; 

  // check if empty task
  const noTaskState = document.querySelector(".no-task-container"); 
  noTaskState.style.display = (total == 0) ? "flex" : "none";

  // progress update
  const progressNumber = document.querySelector("#progress-number"); 
  progressNumber.textContent = `${checkedCount} / ${total}`; 

  const progress = document.getElementById("progress");
  progress.style.width = `${percentage}%`; 

  const words = document.getElementById("progress-words"); 
  if (total === checkedCount && total !== 0) {
    confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    });
    words.textContent = "WELL DONE!"; 
  } else {
    words.textContent = "Keep it up!"
  }

}
