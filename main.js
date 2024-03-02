const populateAuctionIndexedDb = (auctions) => {
  const req = window.indexedDB.open("capitalCityDb", 1);

  req.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore("auctionStore", { keyPath: "id" });

    objectStore.createIndex("auctionId", "auctionId", { unique: true });
  };

  req.onerror = (err) => console.error(`indexedDB failed with: ${err}`);

  // Once db opens, populate it with any new auctions
  req.onsuccess = (event) => {
    const db = event.target.result;

    const transaction = db.transaction(["auctionStore"], "readwrite");
    const auctionStore = transaction.objectStore("auctionStore");

    Array.from(auctions).forEach((auctionElement) => {
      // console.log("AuctionId: " + getAuctionId(auctionElement));
      const newAuction = {
        id: getAuctionIdFromAuction(auctionElement),
        viewed: false,
      };
      auctionStore.add(newAuction);
    });
  };
};

const toggleViewedStyles = (element) => {
  const viewedColor = "bg-primary";
  const notViewedColor = "bg-secondary";
  if (element.classList.contains(viewedColor)) {
    element.classList.remove(viewedColor);
    element.classList.add(notViewedColor);
    element.textContent = "Not Viewed";
  } else {
    element.classList.remove(notViewedColor);
    element.classList.add(viewedColor);
    element.textContent = "Viewed";
  }
};

const getAuctionIdFromAuction = (element) => {
  // Used to grab auction ID from non-injected elements
  return element
    .querySelector(".auctionGrid-para")
    .querySelector(".btn")
    .attributes.onClick.value.match("AuctionId=([^&]+)")[1];
};

const updateStatusIndicatorAndDb = (element, auctionId) => {
  const req = window.indexedDB.open("capitalCityDb", 1);

  req.onsuccess = (event) => {
    db = event.target.result;

    const transaction = db.transaction(["auctionStore"], "readwrite");
    const auctionStore = transaction.objectStore("auctionStore");

    const getReq = auctionStore.get(auctionId);

    getReq.onsuccess = function (event) {
      const entry = event.target.result;

      if (entry) {
        entry.viewed = !entry.viewed;
        const updateReq = auctionStore.put(entry);

        updateReq.onsuccess = function () {
          console.log("Updated db key: " + auctionId);
          toggleViewedStyles(element);
        };
      }
    };
  };
};

const addAuctionViewStatusIndicators = (auctions) => {
  Array.from(auctions).forEach((element) => {
    var statusIndicator = document.createElement("div");
    statusIndicator.textContent = "Not Viewed";
    const auctionId = getAuctionIdFromAuction(element);
    const customStyles = `cursor: pointer`;
    const classes = [
      "p-2",
      "bg-secondary",
      "mb-2",
      "text-primary",
      "text-center",
    ];

    // Perform logic to set initial styles based on state

    statusIndicator.classList.add(...classes);
    statusIndicator.setAttribute("style", customStyles);
    statusIndicator.setAttribute("data-auctionId", auctionId);
    element.insertBefore(statusIndicator, element.firstChild);

    const req = window.indexedDB.open("capitalCityDb", 1);

    req.onsuccess = (event) => {
      db = event.target.result;

      const transaction = db.transaction(["auctionStore"], "readwrite");
      const auctionStore = transaction.objectStore("auctionStore");

      const getReq = auctionStore.get(auctionId);

      getReq.onsuccess = function (event) {
        const entry = event.target.result
        if (entry.viewed) {
          // Everything starts as unviewed
          toggleViewedStyles(statusIndicator);
        }
      };

      getReq.onerror = function (event) {
        console.log("Auction state not found: might be a first time setup issue");
      }
    };

    statusIndicator.addEventListener("click", function () {
      updateStatusIndicatorAndDb(this, auctionId);
    });
  });
};

const setAuctionsState = () => {
  let auctions = document.getElementsByClassName("Auction-main");

  const getInitialAuctionState = () => {
    if (auctions.length === 0) {
      setTimeout(() => {
        auctions = document.getElementsByClassName("Auction-main");
        getInitialAuctionState();
      }, 1000);
    } else {
      populateAuctionIndexedDb(auctions);
      addAuctionViewStatusIndicators(auctions);
    }
  };

  getInitialAuctionState();
};

document.addEventListener("DOMContentLoaded", [
  setAuctionsState(),
  console.log("extension loaded"),
]);
