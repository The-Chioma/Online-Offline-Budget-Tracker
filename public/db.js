if('serviceWorker' in navigator){
    window.addEventListener("load", () => {
        navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).then((reg) => {
                console.log("Service Worker Registered:" + reg)
        }).catch((err) => {
            console.log(err)
        })
    })
}

const indexedDB = window.indexedDB;

let db;
// This will create a new database request for our database.
const req = indexedDB.open("budget", 1);

req.onupgradeneeded = e => {
  // This will create the object store called "pending" and set autoIncrement to true
  const db = e.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};
req.onsuccess = e => {
  db = e.target.result;
  // This will check if app is online before reading from the database
  if (navigator.onLine) {
    checkDatabase();
  }
};
req.onerror = e => {
  console.log(e.target.errorCode);
};

const saveRec = rec => {
  const transaction = db.transaction(["pending"], "readwrite");
  const objStore = transaction.objectStore("pending");
  objStore.add(rec);
}
const checkDb = () => {
  const transaction = db.transaction(["pending"], "readwrite");
  const objStore = transaction.objectStore("pending");
  const getTransactions = objStore.getAll();
  getTransactions.onsuccess = () => {
    if (getTransactions.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getTransactions.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const objStore = transaction.objectStore("pending");
          objStore.clear();
        });
    }
  };
}
// This will listen to check if the app is back online
window.addEventListener("online", checkDb);