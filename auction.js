const awaitLoadingCompleted = () => {
  const checkLoadingIconVisibility = () => {
    let loading = document.getElementById("loader-wrapper").style.display;
    if (loading !== "none") {
      setTimeout(() => {
        loading = document.getElementById("loader-wrapper").style.display;
        checkLoadingIconVisibility();
      }, 1000);
    } else {
      console.info("done loading");
      setMarkers();
      setPaginationListener();
    }
  };

  checkLoadingIconVisibility();
};

const setMarkers = () => {
  const getItemStatus = (info) => {
    if (info.includes("item is new")) {
      return 1;
    } else if (info.includes("as-is")) {
      return 2;
    } else {
      return 0;
    }
  };

  const appendItemMarker = (element, background, textContent) => {
    let newItemMarker = document.createElement("div");
    const elementToInsertBefore = element.querySelector(".tooltip-demos");
    const classes = ["btn", "pt-2", "text-center", "extension-marker"];

    newItemMarker.classList.add(...classes, background);
    newItemMarker.textContent = textContent;

    elementToInsertBefore.parentElement.insertBefore(
      newItemMarker,
      elementToInsertBefore
    );
  };

  const auctionItems = document.getElementsByClassName(
    "row pb-3 mt-2 border-bottom border auction-item-cardcolor"
  );

  Array.from(auctionItems).forEach((item) => {
    const itemInformation = item
      .querySelector(".tooltip-demos")
      .innerHTML.toLowerCase();

    const itemStatus = getItemStatus(itemInformation);
    let background = "",
      textContent = "";

    switch (itemStatus) {
      case 1:
        background = "bg-primary";
        textContent = "New";
        break;
      case 2:
        background = "bg-secondary";
        textContent = "As-Is";
        break;
      default:
        background = "bg-danger";
        textContent = "Other";
        break;
    }

    appendItemMarker(item, background, textContent);
  });
};

// const toggleViewedStyles = () => {
//   const indicator = document.querySelector("#viewedbutton");
//   const viewedColor = "bg-primary";
//   const notViewedColor = "bg-secondary";

//   if (element.classList.contains(viewedColor)) {
//     element.classList.remove(viewedColor);
//     element.classList.add(notViewedColor);
//     element.textContent = "Not Viewed";
//   } else {
//     element.classList.remove(notViewedColor);
//     element.classList.add(viewedColor);
//     element.textContent = "Viewed";
//   }
// };

const updateDbEntryViewedStatus = () => {
  const params = new URLSearchParams(window.location.search);
  const auctionId = encodeURIComponent(params.get("AuctionId"));
  const req = window.indexedDB.open("capitalCityDb", 1);

  req.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction(["auctionStore"], "readwrite");
    const auctionStore = transaction.objectStore("auctionStore");

    const getReq = auctionStore.get(auctionId);

    getReq.onsuccess = () => {
      // This is undefined and breaking any functionality
      let entry = getReq.result;
      debugger;
    };
  };
};

// THIS WORKS IN MAIN.JS
// auctionId
// "K7binv0l%2fPOznSs6%2f29QAQ%3d%3d"
// typeof auctionId
// "string"

const addViewedButton = () => {
  const parent = document.querySelector("#divAuctionTotalList");
  const classes = ["text-center", "h2", "bg-primary"];
  const customStyles = `cursor: pointer`;
  let viewedBtn = document.createElement("div");

  viewedBtn.setAttribute("style", customStyles);
  viewedBtn.id = "viewedButton";
  viewedBtn.classList.add(...classes);

  // Lets try reading from the db here

  const params = new URLSearchParams(window.location.search);
  const auctionId = encodeURIComponent(params.get("AuctionId"));
  const req = window.indexedDB.open("capitalCityDb", 1);
  debugger

  req.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction(["auctionStore"], "readwrite");
    const auctionStore = transaction.objectStore("auctionStore");

    const getReq = auctionStore.get(auctionId);
    getReq.onsuccess = (event) => {
      let entry = event.target.result;

      if (entry) {
        console.info("got state");
      } else {
        console.info("didnt get state");
      }
    };
  };

  viewedBtn.textContent = "Viewed";

  parent.appendChild(viewedBtn);
  viewedBtn.addEventListener("click", function () {
    updateDbEntryViewedStatus();
  });
};

const setPaginationListener = () => {
  document.querySelectorAll(".page-item").forEach((element) => {
    element.addEventListener("click", () => {
      const hasMarkers =
        document.getElementsByClassName("extension-marker").length != 0;

      if (hasMarkers) {
        setTimeout(() => {
          setMarkers();
          setPaginationListener();
        }, 1000);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", [
  awaitLoadingCompleted(),
  addViewedButton(),
]);
