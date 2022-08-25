document.getElementById("entry").addEventListener('keyup', (e) => {
    if (e.code === "Enter") {
        processInformation()
    }
});

const data = [];

data.push(["First Name","Last Name", "Sign In Time", "Sign Out Time"]);

function processInformation() {
    let input = document.getElementById("entry").value;
    if(!(input.includes("=")||input.includes(" "))||input.includes(";")){
        document.getElementById("entry").value = "";
        return;
    }
    let first = getFirst(input);
    let last = getLast(input);
    if(doesEntryExist(first,last)==-1){
        addNewEntry(first,last);
    } else {
        let today = new Date();
        let time = today.getHours() + ":" +today.getMinutes();
        document.getElementById("table-body").children[doesEntryExist(first,last)].children[3].innerHTML = hourConversion(time);
        document.getElementById("table-body").children[doesEntryExist(first,last)].setAttribute("class", "table-success");
        data[doesEntryExist(first,last)][3] = hourConversion(time);
    }
    document.getElementById("entry").value = "";
}

function getFirst(input) {
    if(input.includes("=")){
        let string = input.substring(input.indexOf("=",input.indexOf("=")+1)+1,input.indexOf("/"));
        return string.substring(0,1).toUpperCase()+string.substring(1).toLowerCase();
    }
    if(input.includes(" ")){
        let string = input.substring(0,input.indexOf(" "));
        return string.substring(0,1).toUpperCase()+string.substring(1).toLowerCase();
    }
}

function getLast(input) {
    if(input.includes("=")){
        let string = input.substring(input.indexOf("/")+1,input.indexOf("=",input.indexOf("/")));
        return string.substring(0,1).toUpperCase()+string.substring(1).toLowerCase();
    }
    if(input.includes(" ")){
        let string = input.substring(input.indexOf(" ")+1);
        return string.substring(0,1).toUpperCase()+string.substring(1).toLowerCase();
    }
}

function doesEntryExist(firstName, lastName) {
    for(let i = 0; i<data.length; i++){
        if(data[i][0]==firstName&&data[i][1]==lastName){
            return i-1;
        }
    }
    return -1;
}

function addNewEntry(first,last) {
    let today = new Date();
    let time = today.getHours() + ":" +today.getMinutes();
    let entry = document.createElement("tr");
    entry.setAttribute("class","table-warning");
    let firstName = document.createElement("td");
    let lastName = document.createElement("td");
    let checkInTime = document.createElement("td");
    let checkOutTime = document.createElement("td");
    let innerData = [first,last,hourConversion(time),""];
    data.push(innerData);
    firstName.innerText = first;
    lastName.innerText = last;
    checkInTime.innerText = hourConversion(time);
    checkOutTime.innerText = "";
    entry.appendChild(firstName);
    entry.appendChild(lastName);
    entry.appendChild(checkInTime);
    entry.appendChild(checkOutTime);
    document.getElementById("table-body").appendChild(entry);
}

function hourConversion(time) {
    let hour = time.substring(0,time.indexOf(":"));
    if(parseInt(hour)>12){
        return minuteCorrection(parseInt(hour)-12+time.substring(time.indexOf(":")))+" PM";
    }
    if(parseInt(hour)==0){
        return minuteCorrection(12+time.substring(time.indexOf(":")))+" AM";
    }
    return minuteCorrection(time)+" AM";
}

function minuteCorrection(time) {
    if(parseInt(time.substring(time.indexOf(":")+1))<10){
        return time.substring(0,time.indexOf(":")+1)+"0"+time.substring(time.indexOf(":")+1);
    }
    return time;
}

function dataConversion() {
    let output = "";
    for(let i = 0; i<data.length; i++){
        output += data[i][0]+","+data[i][1]+","+data[i][2]+","+data[i][3]+"\n";
    }
    return output;
}

// Function to download data to a file
function download(filename, type) {
    var file = new Blob([dataConversion()], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}