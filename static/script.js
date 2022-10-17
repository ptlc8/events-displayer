const Events = (function(){
    function get() {
        return sendRequest("GET", "api/events");
    }
    function getByAsso(asso) {
        return sendRequest("GET", "api/events", {asso});
    }
    function add(event) {
        return sendRequest("POST", "api/events/add", event);
    }
    function edit(event) {
        return sendRequest("POST", "api/events/edit", event);
    }
    function remove(event) {
        return sendRequest("POST", "api/events/remove", event);
    }
    return { get, getByAsso, add, edit, remove }
})();

const Assos = (function(){
    function get() {
        return sendRequest("GET", "api/assos");
    }
    return { get }
})();

function sendRequest(method, url, body=undefined, headers={"Content-Type":"application/json"}) {
    var promise = new (Promise||ES6Promise)(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let h of Object.keys(headers))
            xhr.setRequestHeader(h, headers[h]);
        xhr.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                if (200 == this.status)
                    resolve(JSON.parse(this.response));
                else reject({error:this.response,status:this.status,success:false});
            }
        };
        xhr.onerror = reject;
        xhr.send(JSON.stringify(body));
    });
    return promise;
}

function createElement(tag, properties={}, inner=[], eventListeners={}) {
    let el = document.createElement(tag);
    for (let p of Object.keys(properties)) if (p!="style" && p!="dataset") el[p] = properties[p];
    if (properties.style) for (let p of Object.keys(properties.style)) el.style[p] = properties.style[p];
    if (properties.dataset) for (let p of Object.keys(properties.dataset)) el.dataset[p] = properties.dataset[p];
    if (typeof inner == "object") for (let i of inner) el.appendChild(typeof i == "string" ? document.createTextNode(i) : i);
    else el.innerText = inner;
    for (let l of Object.keys(eventListeners)) el.addEventListener(l, eventListeners[l]);
    return el;
}