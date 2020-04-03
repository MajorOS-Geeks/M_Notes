let trashObj = [];
const searchTxt = document.getElementById("searchTxt");
const searchButton = document.getElementById("searchButton");
let notesObj = []
class MajorNotesTrashOperations {

    deleteNote(index) {
        let trash = localStorage.getItem("trash");
        if (trash == null)
            trashObj = [];
        else
            trashObj = JSON.parse(trash);

        trashObj.splice(index, 1);
        localStorage.setItem("trash", JSON.stringify(trashObj));
        this.showTrashNotes();
    }

    randomRBGColorForNotes(noteID) {
        const localNoteID = document.getElementById(noteID);
        const x = Math.floor(Math.random() * 256);
        const y = Math.floor(Math.random() * 256);
        const z = Math.floor(Math.random() * 256);
        let rbgColor = "rgb(" + x + "," + y + "," + z + ")";
        localNoteID.style.background = rbgColor;
    }

    restoreNotesFromTrash(noteTitle, noteText, noteDate, index) {

        let fullNoteObj = {
            Title: noteTitle,
            Text: noteText,
            Date: noteDate
        };

        notesObj = JSON.parse(localStorage.getItem("notes"));
        notesObj.push(fullNoteObj);
        localStorage.setItem("notes", JSON.stringify(notesObj));
        
        this.deleteNote(index);
    }
 
    showTrashNotes() {

        let trashNotes = localStorage.getItem("trash");
        let myTrashNotes = document.getElementById("trashNotes");
        let addNotes = "";

        if (trashNotes == null)
            trashObj = [];
        else
            trashObj = JSON.parse(trashNotes);

        trashObj.forEach(function (element, index) {
            addNotes += `
        <div id = "myCard${index + 1}" class = "noteCard my-2 mx-2 card div-block-22" style = "width: 300px; height:10%" onmouseover="document.getElementById('myMenuButton${index + 1}').removeAttribute('hidden')" onmouseout="document.getElementById('myMenuButton${index + 1}').setAttribute('hidden', 'true')">
            <div class="dropdown">
                <button class="buttonFloat Header__Icon Icon-Wrapper Icon-Wrapper--clickable " id="myMenuButton${index + 1}" aria-expanded="false" data-action="open-drawer" data-drawer-id="sidebar-menu" aria-label="Open navigation" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" hidden>
                    <span class="hidden-tablet-and-up"><svg class="Icon Icon--nav" role="presentation" viewBox="0 0 20 14">
                        <path d="M0 14v-1h20v1H0zm0-7.5h20v1H0v-1zM0 0h20v1H0V0z" fill="currentColor"></path>
                    </svg></span>
                    <span class="hidden-phone"><svg class="Icon Icon--nav-desktop" role="presentation" viewBox="0 0 24 16">
                        <path d="M0 15.985v-2h24v2H0zm0-9h24v2H0v-2zm0-7h24v2H0v-2z" fill="currentColor"></path>
                    </svg></span>
                </button>
                <!-- <button style="background-color: white; color: black" class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button> -->
                <div class="dropdown-menu div-block-222" aria-labelledby="dropdownMenuButton" style="background-color: black">
                    <a class="dropdown-item" id="${index}" href="#" onclick="MajorNotesTrashOperationsObj.deleteNote(this.id);">Delete From Trash</a>
                    <a class="dropdown-item" href="#" onclick="MajorNotesTrashOperationsObj.restoreNotesFromTrash('${element.Title}', '${element.Text}', '${element.Date}','${index}')">Restore From Trash</a>
                </div>
            </div>
            <style onload="MajorNotesTrashOperationsObj.randomRBGColorForNotes('myCard${index + 1}')"></style>
            <div class="card-body">
                <h5 id="noteTitle${index + 1}" class="card-title color-white">${element.Title}</h5>
                <p id="noteText${index + 1}" class="color-white">${element.Text}</p>
                <!-- <button id = "${index}" style="position: absolute" onclick = "MajorNotesTrashOperationsObj.deleteNote(this.id);" class = "btn btn-primary">Delete</button> -->
                <p id="noteAddedDate" class="color-white" style="text-align: end;">${element.Date}</p>
            </div>
        </div>`
        });
        if (trashObj.length != 0)
            myTrashNotes.innerHTML = addNotes;
        else
            myTrashNotes.innerHTML = `Nothing to show! The trash has been cleared.`
    }

    searchingNoteByTitleAndText() {
        let searchingText = searchTxt.value;
        let trashCard = document.getElementsByClassName("noteCard");
        Array.from(trashCard).forEach(function (element) {
            let cardText = element.getElementsByTagName("p")[0];
            let cardDate = element.getElementsByTagName("p")[1];
            let cardTitle = element.getElementsByTagName("h5")[0];
            if (cardText.innerHTML.toLowerCase().includes(searchingText) || cardTitle.innerHTML.toLowerCase().includes(searchingText) || cardDate.innerHTML.toLowerCase().includes(searchingText)
                || cardText.innerHTML.toUpperCase().includes(searchingText) || cardTitle.innerHTML.toUpperCase().includes(searchingText) || cardDate.innerHTML.toUpperCase().includes(searchingText)
                || cardText.innerHTML.includes(searchingText) || cardTitle.innerHTML.includes(searchingText) || cardDate.innerHTML.includes(searchingText))
                element.style.display = "block";
            else
                element.style.display = "none";
        });
    }

}

const MajorNotesTrashOperationsObj = new MajorNotesTrashOperations();
MajorNotesTrashOperationsObj.showTrashNotes() // Calling showNotes function bcoz we don't want the notes to be gone when our web-page refreshes.

searchTxt.addEventListener("input", () => {
    MajorNotesTrashOperationsObj.searchingNoteByTitleAndText();
});

searchButton.addEventListener("click", () => {
    MajorNotesTrashOperationsObj.searchingNoteByTitleAndText();
});

