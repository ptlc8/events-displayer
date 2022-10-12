var EVENT_DURATION = 10_000;
var EVENT_TRANSITION_DURATION = 500;
var UPDATE_TIMEOUT = 60*1_000;
var RELOAD_TIMEOUT = 60*60*1_000;
var EVENTS = null;

window.addEventListener("load", async function() {
    await updateEvents();
    nextEvent();
    this.setInterval(updateEvents, UPDATE_TIMEOUT);
    setInterval(nextEvent, EVENT_DURATION);
    setTimeout(()=>window.location.reload(), RELOAD_TIMEOUT);
});

async function updateEvents() {
    EVENTS = JSON.parse(await sendRequest("GET", "events.json"));
}

let eventIndex = 0;
function nextEvent() {
    let elementsToDelete = [...document.body.children];
    setTimeout(function(){
        for (let el of elementsToDelete)
            document.body.removeChild(el);
    }, EVENT_TRANSITION_DURATION);
    eventElement = displayEvent(EVENTS[eventIndex++%EVENTS.length]);
    eventElement.style.opacity = 0;
    window.getComputedStyle(eventElement).opacity; // useful to update style
    eventElement.style.opacity = "";
}

function displayEvent(event) {
    var eventEl, qr;
    document.body.appendChild(eventEl=createElement("article", {className:"event", style:{backgroundColor:event.color}}, [
        createElement("h1", {className:"title"}, event.title),
        createElement("div", {className:"data"}, [
            event.poster ? createElement("img", {className:"poster", src:event.poster}) : "",
            createElement("div", {className:"details"}, [
                createElement("span", {className:"description"}, event.description),
                createElement("span", {className:"asso"}, [
                    createElement("img", {className:"logo",src:event.asso.logo}),
                    createElement("span", {}, event.asso.name)
                ]),
                createElement("span", {className:"datetime"}, [
                    createElement("span", {className:"material-icons"}, "event"),
                    createElement("span", {}, computeDate(event.date)+" à "+computeTime(event.time))
                ]),
                createElement("span", {className:"place"}, [
                    createElement("span", {className:"material-icons"}, "place"),
                    createElement("span", {}, event.place)
                ]),
                event.price ? createElement("span", {className:"price"}, [
                    createElement("span", {className:"material-icons"}, "savings"),
                    createElement("span", {}, event.price)
                ]) : "",
                qr=createElement("div", {className:"qr"})
            ])
        ])
    ]));
    new QRCode(qr, event.link);
    return eventEl;
}

function computeDate(date) {
    var timestamp = Date.parse(date+"T00:00");
    var daystamp = Math.floor(timestamp / 1000/60/60/24);
    var nowDaystamp = Math.floor(Date.now() / 1000/60/60/24);
    if (daystamp == nowDaystamp)
        return "Aujourd'hui";
    if (daystamp-1 == nowDaystamp)
        return "Demain";
    date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {weekday:"long",day:"numeric",month:"long"});
}

function computeTime(time) {
    return time.replace(":","h");
}