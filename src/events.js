window.addEventListener("load", refreshEvents);

function refreshEvents() {
    Events.getByAsso("TODO!").then(function(events) {
        var eventsTable = document.getElementById("events");
        for (let event of events) {
            eventsTable.appendChild(createElement("tr", {}, [
                createElement("td", {}, event.title),
                createElement("td", {}, event.asso.name),
                createElement("td", {}, event.date),
                createElement("td", {}, [createElement("button", {}, "Modifier", {click:()=>editEvent(event)})]),
                createElement("td", {}, [createElement("button", {}, "Supprimer", {click:()=>deleteEvent(event.id)})])
            ]));
        }
    });
}

function deleteEvent(id) {
    Events.remove(id).then(refreshEvents);
}

function editEvent(event) {
    // TODO
}