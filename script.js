document.addEventListener("DOMContentLoaded", () => {
   const taskInput = document.getElementById("task-input");
   const addTaskButton = document.getElementById("add-task-btn");
   const taskList = document.getElementById("task-list");
   const emptyImage = document.getElementById("empty-image");
   const container = document.querySelector(".container");
   const progressBar = document.getElementById("progress");
   const progressNumber = document.getElementById("numbers");
   const form = document.querySelector(".input-area");

   const toggleEmptyState = () => {
       if (emptyImage) {
          emptyImage.style.display =
             taskList.children.length === 0 ? "block" : "none";
       }

       container.style.width =
          taskList.children.length === 0 ? "100%" : "50%";
   };

   const updateProgressBar = (checkCompletion = true) => {
       const totalTasks = taskList.children.length;
       const completedTasks = taskList.querySelectorAll(".checkbox:checked").length;

       progressBar.style.width = totalTasks
           ? `${(completedTasks / totalTasks) * 100}%`
           : "0%";

       progressNumber.textContent = `${completedTasks} / ${totalTasks}`;
   };

   // ================================
   // GUARDAR EN LOCAL STORAGE
   // ================================
   const saveTaskToLocalStorage = () => {
      const tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
         text: li.querySelector("span").textContent,
         completed: li.querySelector(".checkbox").checked
      }));

      localStorage.setItem("tasks", JSON.stringify(tasks));
   };

   // ================================
   // CARGAR LOCAL STORAGE
   // ================================
   const loadTasksFromLocalStorage = () => {
      const savedTasks =
         JSON.parse(localStorage.getItem("tasks")) || [];

      savedTasks.forEach(({ text, completed }) =>
         addTask(text, completed, false)
      );

      toggleEmptyState();
      updateProgressBar();
   };

   // Ahora sí la llamamos

   // ================================
   // AGREGAR TAREA
   // ================================
   const addTask = (text, completed = false, checkCompletion = true) => {

      const taskText = text || taskInput.value.trim();

      if (!taskText) return;

      const li = document.createElement("li");

      li.innerHTML = `
         <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
         <span>${taskText}</span>

         <div class="task-buttons">
            <button class="edit-btn">
               <i class="fas fa-pen"></i>
            </button>

            <button class="delete-btn">
               <i class="fas fa-trash"></i>
            </button>
         </div>
      `;

      const checkbox = li.querySelector(".checkbox");
      const editBtn = li.querySelector(".edit-btn");

      if (completed) {
         li.classList.add("completed");
         editBtn.disabled = true;
         editBtn.style.opacity = 0.5;
         editBtn.style.pointerEvents = "none";
      }

      checkbox.addEventListener("change", () => {

         const isChecked = checkbox.checked;

         li.classList.toggle("completed", isChecked);

         editBtn.disabled = isChecked;
         editBtn.style.opacity = isChecked ? 0.5 : 1;
         editBtn.style.pointerEvents = isChecked ? "none" : "auto";

         updateProgressBar();
         saveTaskToLocalStorage();

      });

      editBtn.addEventListener("click", () => {

         if (!checkbox.checked) {

            taskInput.value = li.querySelector("span").textContent;

            li.remove();

            toggleEmptyState();
            updateProgressBar(false);
            saveTaskToLocalStorage();
         }

      });

      li.querySelector(".delete-btn").addEventListener("click", () => {

         li.remove();

         toggleEmptyState();
         updateProgressBar();
         saveTaskToLocalStorage();

      });

      taskList.appendChild(li);

      taskInput.value = "";

      toggleEmptyState();
      updateProgressBar(checkCompletion);
      saveTaskToLocalStorage();
   };

       loadTasksFromLocalStorage();

       form.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
    });
});