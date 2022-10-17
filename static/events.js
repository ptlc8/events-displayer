window.addEventListener("load", refreshEvents);

function refreshEvents() {
    Promise.all([Events.getByAsso("TODO!"),Assos.get()]).then(function([events,assos]) {
        var eventsTable = document.getElementById("events");
        while (eventsTable.firstChild)
            eventsTable.removeChild(eventsTable.firstChild);
        for (let event of events) {
            eventsTable.appendChild(createElement("tr", {}, [
                createElement("td", {}, event.title),
                createElement("td", {}, event.asso?assos.find(a=>a.id==event.asso).name:""),
                createElement("td", {}, event.date),
                createElement("td", {}, [createElement("button", {}, "Modifier", {click:()=>editEvent(event)})]),
                createElement("td", {}, [createElement("button", {}, "Supprimer", {click:()=>deleteEvent(event)})])
            ]));
        }
    });
}

function deleteEvent(event) {
    if (!confirm("Voulez-vous supprimer "+event.title))
        return;
    Events.remove(event).then(refreshEvents);
}

function editEvent(event) {
    // TODO
}