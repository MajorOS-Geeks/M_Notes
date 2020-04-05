// console.log("Welcome to notes app");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
const recognition = new SpeechRecognition();
const textToSpeak = new SpeechSynthesisUtterance();
const myJarvis = document.getElementById("myJarvis");
const searchTxt = document.getElementById("searchTxt");
const searchButton = document.getElementById("searchButton");
const addTxt = document.getElementById("addText");
const addTitle = document.getElementById("addTitle");
const addBtn = document.getElementById("addBtn");
const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var notesObj = [];
var trashObj = [];
let flag;
let myArrayOfTitles;

class MajorNotesOperation {
    // function to delete note
    deleteNote(index) {
        let notes = localStorage.getItem("notes");
        if (notes == null)
            notesObj = [];
        else
            notesObj = JSON.parse(notes);

        notesObj.splice(index, 1);
        localStorage.setItem("notes", JSON.stringify(notesObj));
        this.showNotes();
    }

    duplicateNote(title, text) {

        let fullNoteObj = {
            Title: title,
            Text: text,
            Date: `${new Date().getHours()}:${new Date().getMinutes()}<br>${weekDay[new Date().getDay()]}, ${new Date().getDate()} ${monthName[new Date().getMonth()]}`
        }

        notesObj.push(fullNoteObj);
        localStorage.setItem("notes", JSON.stringify(notesObj));
        this.showNotes();
    }

    showNotes() {

        let notes = localStorage.getItem("notes");
        let myCardNotes = document.getElementById("cardNotes");
        let addNotes = "";

        if (notes == null)
            notesObj = [];
        else
            notesObj = JSON.parse(notes);

        notesObj.forEach(function (element, index) {
            addNotes += `
            <div id = "myCard${index + 1}" class = "noteCard my-2 mx-2 card div-block-22" style = "width: 300px; height:0%" onmouseover="document.getElementById('myMenuButton${index + 1}').removeAttribute('hidden')" onmouseout="document.getElementById('myMenuButton${index + 1}').setAttribute('hidden', 'true')">
                <div class="dropdown" style="color: white">
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
                        <a class="dropdown-item" id="${index}" href="#" onclick="MajorOperationsObj.addNoteToTrash('${element.Title}', '${element.Text}', '${element.Date}'); MajorOperationsObj.deleteNote(this.id);">Delete note</a>
                        <a class="dropdown-item" href="#" onclick="MajorOperationsObj.duplicateNote('${element.Title}', '${element.Text}')">Duplicate note</a>
                    </div>
                </div>
                <style onload="MajorOperationsObj.randomRBGColorForNotes('myCard${index + 1}')"></style>
                <div class="card-body">
                    <h5 id="noteTitle${index + 1}" class="card-title color-white" onclick = "MajorOperationsObj.editMyText(this.id);" onblur = "MajorLocalStorageObj.addTextTOLocalStorage(this.id,'Title', ${index});">${element.Title}</h5>
                    <p id="noteText${index + 1}" class="color-white" onclick = "MajorOperationsObj.editMyText(this.id);" onblur = "MajorLocalStorageObj.addTextTOLocalStorage(this.id, 'Text', ${index});">${element.Text}</p>
                    <!-- <button id = "${index}" style="position: absolute" onclick = "MajorOperationsObj.deleteNote(this.id);" class = "btn btn-primary">Delete</button> -->
                    <p id="noteAddedDate" class="color-white" style="text-align: end;">${element.Date}</p>
                   
                </div>
            </div>`
        });

        if (notesObj.length != 0)
            myCardNotes.innerHTML = addNotes;
        else
            myCardNotes.innerHTML = `Nothing to show! Use "Add a Note" section above to add notes.`
    }

    searchingNoteByTitleAndText() {
        let searchingText = searchTxt.value;
        let noteCard = document.getElementsByClassName("noteCard");
        Array.from(noteCard).forEach(function (element) {
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

    showAlert(type, message) {
        let typeMessage;
        if (type == "danger")
            typeMessage = "Error";
        else
            typeMessage = "Success";
        const submitStatusMessage = document.getElementById("addNoteStatus");
        let promptMessage = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                                <strong>${typeMessage}:</strong> ${message}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`
        submitStatusMessage.innerHTML = promptMessage;
        setTimeout(() => {
            submitStatusMessage.innerHTML = '';
        }, 5000);
    }

    editMyText = function (myId) {
        let editId = document.querySelector(`#${myId}`);
        editId.contentEditable = "True";
    }


    randomRBGColorForNotes = function (noteID) {
        const localNoteID = document.getElementById(noteID);
        const x = Math.floor(Math.random() * 256);
        const y = Math.floor(Math.random() * 256);
        const z = Math.floor(Math.random() * 256);
        let rbgColor = "rgb(" + x + "," + y + "," + z + ")";
        localNoteID.style.background = rbgColor;
    }

    addNoteToTrash(noteTitle, noteText, noteDate) {
        // console.log(Text + " " + Title + " " + noteDate);
        trashObj = [];
        let fullNoteObj = {
            Title: noteTitle,
            Text: noteText,
            Date: noteDate
        };
        // console.log(trashObj);
        trashObj = localStorage.getItem("trash");
        if (trashObj == null) {
            trashObj = [fullNoteObj];
        }
        else {
            trashObj = JSON.parse(trashObj);
            trashObj.push(fullNoteObj)
        }
        // console.log(trashObj);
        localStorage.setItem("trash", JSON.stringify(trashObj));
        // this.showTrashNotes();

    }

}

class MajorLocalStorage {

    addTextTOLocalStorage = function (myId, type, index) {
        let editId = document.querySelector(`#${myId}`);
        notesObj[index][type] = editId.innerHTML;
        localStorage.setItem('notes', JSON.stringify(notesObj));
    }

}

class MajorSpeak {

    speek(text) {
        textToSpeak.text = text;
        let myArrayOfTitles = localStorage.getItem("notes");
        myArrayOfTitles = JSON.parse(myArrayOfTitles);
        if (textToSpeak.text.includes("major add a note")) {
            speechSynthesis.speak(new SpeechSynthesisUtterance("please tell the title and text of a note."));
            setTimeout(1000);
            flag = true;
        }
        else if (textToSpeak.text.includes("major delete note")) {
            textToSpeak.text = textToSpeak.text.replace("delete note ", "");
            console.log(textToSpeak.text);
            Array.from(myArrayOfTitles).forEach((element, index) => {
                console.log(element.Title.toLowerCase());
                if (textToSpeak.text == element.Title.toLowerCase())
                    new MajorNotesOperation().deleteNote(index);
            });
        }
        else if (flag == true) {
            flag = false;
            if (text.includes("with title")) {
                addTitle.value = text.split("with title ")[1];
                addTxt.value = text.split("with title ")[0];
            }
            else {
                addTitle.value = "Untitled";
                addTxt.value = text;
            }
            addBtn.click();

        }
    }
}

const MajorOperationsObj = new MajorNotesOperation();
const MajorSpeakObj = new MajorSpeak();
const MajorLocalStorageObj = new MajorLocalStorage();

MajorOperationsObj.showNotes() // Calling showNotes function bcoz we don't want the notes to be gone when our web-page refreshes.

myJarvis.addEventListener("click", () => {
    recognition.start();
});

recognition.onresult = function (event) {
    text = event.results[0][0].transcript;
    MajorSpeakObj.speek(text);
}

recognition.onend = function () {
    flag ? recognition.start() : null;
}

addBtn.addEventListener("click", () => {

    var fullNoteObj = {
        Title: addTitle.value != "" ? addTitle.value : "Untitled",
        Text: addTxt.value,
        Date: `${new Date().getHours()}:${new Date().getMinutes()}<br>${weekDay[new Date().getDay()]}, ${new Date().getDate()} ${monthName[new Date().getMonth()]}`
    };

    if (addTxt.value != "") {
        MajorOperationsObj.showAlert("success", "Note added successfully");
        notesObj.push(fullNoteObj);
        localStorage.setItem("notes", JSON.stringify(notesObj));
        addTxt.value = "";
        MajorOperationsObj.showNotes();
        addTitle.value = "";
    }
    else
        MajorOperationsObj.showAlert("danger", "Cannot add empty note");
});

searchTxt.addEventListener("input", () => {
    MajorOperationsObj.searchingNoteByTitleAndText();
});

searchButton.addEventListener("click", () => {
    MajorOperationsObj.searchingNoteByTitleAndText();
});
