// ======================================
// Smart Notes Pro
// Part 4.1
// ======================================

// Buttons
const addBtn = document.getElementById("addBtn");
const quickAdd = document.getElementById("quickAdd");
const saveBtn = document.getElementById("saveNote");
const closeBtn = document.getElementById("closePopup");

// Popup
const popup = document.getElementById("notePopup");

// Inputs
const titleInput = document.getElementById("title");
const noteInput = document.getElementById("noteText");
const categoryInput = document.getElementById("noteCategory");
const colorInput = document.getElementById("noteColor");
const reminderInput = document.getElementById("reminder");
const favoriteInput = document.getElementById("favorite");
const pinnedInput = document.getElementById("pinned");

// Search
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
 
//Search Box
const searchBox = document.querySelector(".searchBox");

searchBox.addEventListener("click", function () {

    search.focus();

});
// Container
const notesContainer = document.getElementById("notesContainer");

//Page Title
const pageTitle = document.getElementById("pageTitle");

// Dashboard
const totalNotes = document.getElementById("dashboardTotal");
const favoriteNotes = document.getElementById("dashboardFav");
const archivedNotes = document.getElementById("dashboardArchive");
const trashNotes = document.getElementById("dashboardTrash");
// Sidebar Counters
const allCount = document.getElementById("allCount");
const favCount = document.getElementById("favCount");
const archiveCount = document.getElementById("archiveCount");
const trashCount = document.getElementById("trashCount");
// ===============================
// Dark Mode Button
// ===============================

const darkBtn =
document.getElementById("darkMode");

// Data
let notes = JSON.parse(localStorage.getItem("notes")) || [];

let editId = null;
let currentView = "all";

// ===============================
// Open Popup
// ===============================

function openPopup(){

    popup.classList.remove("hidden");

}

addBtn.onclick = openPopup;

quickAdd.onclick = openPopup;

// ===============================
// Close Popup
// ===============================

function closePopup(){

    popup.classList.add("hidden");

    clearInputs();

}

closeBtn.onclick = closePopup;

// ===============================
// Clear Inputs
// ===============================

function clearInputs(){

    titleInput.value = "";

    noteInput.value = "";

    categoryInput.value = "Study";

    colorInput.value = "#4f46e5";

    reminderInput.value = "";

    favoriteInput.checked = false;

    pinnedInput.checked = false;

    editId = null;

    document.getElementById("popupTitle").textContent =
"Create New Note";

}
// ===============================
// Save Note
// ===============================

saveBtn.onclick = function () {

    const title = titleInput.value.trim();
    const text = noteInput.value.trim();

    if (title === "" || text === "") {
        alert("Please fill all fields!");
        return;
    }

    const note = {
        id: Date.now(),
        title: title,
        text: text,
        category: categoryInput.value,
        color: colorInput.value,
        reminder: reminderInput.value,
        favorite: favoriteInput.checked,
        pinned: pinnedInput.checked,
        archived: false,
        trash: false,
        date: new Date().toLocaleString()
    };

    if(editId !== null){

    notes = notes.map(n => {

        if(n.id === editId){

            return{

                ...n,

                title:title,

                text:text,

                category:categoryInput.value,

                color:colorInput.value,

                reminder:reminderInput.value,

                favorite:favoriteInput.checked,

                pinned:pinnedInput.checked

            };

        }

        return n;

    });

}
else{

    notes.push(note);

}

    localStorage.setItem("notes", JSON.stringify(notes));

    closePopup();

    displayNotes();
};

// ===============================
// Create Note Card
// ===============================

function createNoteCard(note){

    return `

    <div class="note" style="border-top:6px solid ${note.color}">

        <div class="noteHeader">

            <h3>${note.title}</h3>

            <div>

                ${note.favorite ? "⭐" : ""}

                ${note.pinned ? "📌" : ""}

            </div>

        </div>

        <span class="category">${note.category}</span>

        <p>${note.text}</p>

        <small>${note.date}</small>

        <div class="noteButtons">

    ${
        note.trash
        ?

        `
        <button
            class="restoreBtn"
            onclick="restoreNote(${note.id})">

            ♻ Restore

        </button>

        <button
            class="deleteForeverBtn"
            onclick="deleteForever(${note.id})">

            ❌ Delete

        </button>
        `

        :

        `

        <button
            class="favoriteBtn"
            onclick="toggleFavorite(${note.id})">

            ⭐

        </button>

        <button
            class="pinBtn"
            onclick="togglePin(${note.id})">

            📌

        </button>

        <button
            class="archiveBtn"
            onclick="archiveNote(${note.id})">

            📦

        </button>

        <button
            class="editBtn"
            onclick="editNote(${note.id})">

            ✏

        </button>

        <button
            class="deleteBtn"
            onclick="deleteNote(${note.id})">

            🗑

        </button>

        `

    }

</div>

    </div>

    `;

}

// ===============================
// Render Notes
// ===============================

function renderNotes(list, emptyMessage){

    notesContainer.innerHTML = "";

    if(list.length === 0){

        notesContainer.innerHTML =
        `<h2 class="empty">${emptyMessage}</h2>`;

        updateDashboard();

        return;
    }

    list.forEach(note => {

        notesContainer.innerHTML += createNoteCard(note);

    });

    updateDashboard();

}

// ===============================
// Active Sidebar Button
// ===============================

function setActiveButton(buttonId){

    document
    .querySelectorAll(".sidebar button")
    .forEach(button=>{

        button.classList.remove("active");

    });

    document
    .getElementById(buttonId)
    .classList.add("active");

}
// ===============================
// Display Notes
// ===============================

function displayNotes(){

      currentView = "all";

    setActiveButton("allBtn");

    pageTitle.textContent = "All Notes";

    renderNotes(

        notes
    .filter(note => !note.archived && !note.trash)
    .sort((a,b) => b.pinned - a.pinned),

        "No Notes Yet 📒"

    );

}

// ===============================
// Favorites
// ===============================

function showFavorites(){

    currentView = "favorites";

    setActiveButton("favBtn");

pageTitle.textContent = "Favorites";

    renderNotes(

       notes
.filter(note =>
    note.favorite &&
    !note.archived &&
    !note.trash
)
.sort((a,b) => b.pinned - a.pinned),

        "No Favorite Notes ⭐"

    );

}

// ===============================
// Archive
// ===============================

function showArchive(){

    currentView = "archive";

    setActiveButton("archiveBtn");

pageTitle.textContent="Archive";


    renderNotes(

        notes.filter(note => note.archived && !note.trash),

        "Archive Empty 📦"

    );

}

// ===============================
// Trash
// ===============================

function showTrash(){

    currentView = "trash";

    setActiveButton("trashBtn");

pageTitle.textContent="Trash";

    renderNotes(

        notes.filter(note => note.trash),

        "Trash Empty 🗑"

    );

}
// ===============================
// Search Notes
// ===============================

function searchNotes() {

    const keyword = searchInput.value.toLowerCase();

    const filtered = notes.filter(note =>

    !note.trash &&

    (

        note.title.toLowerCase().includes(keyword) ||

        note.text.toLowerCase().includes(keyword)

    )

);

    renderFilteredNotes(filtered);

}

// ===============================
// Category Filter
// ===============================

function filterCategory() {

    const selected = categoryFilter.value;

    if (selected === "All") {

        displayNotes();

        return;
    }

   const filtered = notes.filter(note =>

    note.category === selected &&

    !note.trash

);

    renderFilteredNotes(filtered);

}

// ===============================
// Render Filtered Notes
// ===============================

function renderFilteredNotes(list){

    notesContainer.innerHTML = "";

    if(list.length === 0){

        notesContainer.innerHTML =
        "<h2 class='empty'>No Notes Found 🔍</h2>";

        return;

    }

    list.forEach(note => {

        notesContainer.innerHTML += createNoteCard(note);

    });

}
// ===============================
// Dashboard
// ===============================

function updateDashboard() {

    // Dashboard

    totalNotes.textContent =
    notes.filter(note => !note.archived && !note.trash).length;

    favoriteNotes.textContent =
    notes.filter(note => note.favorite && !note.trash).length;

    archivedNotes.textContent =
    notes.filter(note => note.archived).length;

    trashNotes.textContent =
    notes.filter(note => note.trash).length;


    // Sidebar Counters

    allCount.textContent =
    notes.filter(note => !note.archived && !note.trash).length;

    favCount.textContent =
    notes.filter(note => note.favorite && !note.trash).length;

    archiveCount.textContent =
    notes.filter(note => note.archived).length;

    trashCount.textContent =
    notes.filter(note => note.trash).length;

}
// ===============================
// Move Note to Trash
// ===============================

function deleteNote(id){

    if(!confirm("Move this note to Trash?")){

        return;

    }

    notes = notes.map(note => {

        if(note.id === id){

            note.trash = true;

        }

        return note;

    });

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    if(currentView === "all"){

        displayNotes();

    }else if(currentView === "favorites"){

        showFavorites();

    }else if(currentView === "archive"){

        showArchive();

    }else{

        showTrash();

    }

}

// ===============================
// Restore Note
// ===============================

function restoreNote(id){

    notes = notes.map(note => {

        if(note.id === id){

            note.trash = false;

        }

        return note;

    });

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    showTrash();

}

// ===============================
// Delete Forever
// ===============================

function deleteForever(id){

    if(!confirm("Delete this note permanently?")){

        return;

    }

    notes = notes.filter(note => note.id !== id);

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    showTrash();

}

// ===============================
// Favorite
// ===============================

function toggleFavorite(id){

    notes = notes.map(note =>{

        if(note.id===id){

            note.favorite=!note.favorite;

        }

        return note;

    });

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    if(currentView === "all"){

    displayNotes();

}
else if(currentView === "favorites"){

    showFavorites();

}
else if(currentView === "archive"){

    showArchive();

}
else{

    showTrash();

}

}

// ===============================
// Pin
// ===============================

function togglePin(id){

    notes = notes.map(note=>{

        if(note.id===id){

            note.pinned=!note.pinned;

        }

        return note;

    });

    notes.sort((a,b)=>b.pinned-a.pinned);

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    if(currentView === "all"){

    displayNotes();

}
else if(currentView === "favorites"){

    showFavorites();

}
else if(currentView === "archive"){

    showArchive();

}
else{

    showTrash();

}

}
// ===============================
// Archive Note
// ===============================

function archiveNote(id){

    notes = notes.map(note => {

        if(note.id === id){

            note.archived = !note.archived;

        }

        return note;

    });

    localStorage.setItem("notes", JSON.stringify(notes));

    if(currentView === "all"){

    displayNotes();

}
else if(currentView === "favorites"){

    showFavorites();

}
else if(currentView === "archive"){

    showArchive();

}
else{

    showTrash();

}

}

// ===============================
// Edit Note
// ===============================

function editNote(id){

    const note = notes.find(n => n.id === id);

    if(!note) return;

    titleInput.value = note.title;

    noteInput.value = note.text;

    categoryInput.value = note.category;

    colorInput.value = note.color;

    reminderInput.value = note.reminder;

    favoriteInput.checked = note.favorite;

    pinnedInput.checked = note.pinned;

    editId = id;

    document.getElementById("popupTitle").textContent =
"Edit Note";

    popup.classList.remove("hidden");

}

// ===============================
// Dark Mode
// ===============================

function loadTheme(){

    const theme =
    localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark");

        darkBtn.textContent = "☀️";

    }

}

darkBtn.onclick = function(){

    darkBtn.classList.add("rotate");

setTimeout(function(){

    darkBtn.classList.remove("rotate");

},300);

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        darkBtn.textContent = "☀️";

    }else{

        localStorage.setItem("theme","light");

        darkBtn.textContent = "🌙";

    }

};
// ===============================
// Initial Load
// ===============================

loadTheme();

displayNotes();

searchInput.addEventListener("input", searchNotes);
categoryFilter.addEventListener("change", filterCategory);
document.getElementById("allBtn").onclick = () => {

    currentView = "all";

    displayNotes();

};

document.getElementById("favBtn").onclick = showFavorites;

document.getElementById("archiveBtn").onclick = showArchive;

document.getElementById("trashBtn").onclick = showTrash;
