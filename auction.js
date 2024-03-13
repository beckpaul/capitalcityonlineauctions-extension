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

const getAuctionId = () => {
  const params = new URLSearchParams(window.location.search);
  return encodeURIComponent(params.get("AuctionId"))
    .substring(0, 10)
    .toLowerCase();
};

const updateDbEntryViewedStatus = () => {
  const auctionId = getAuctionId();

  const req = window.indexedDB.open("capitalCityDb", 1);

  req.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction(["auctionStore"], "readwrite");
    const auctionStore = transaction.objectStore("auctionStore");

    const getReq = auctionStore.get(auctionId);

    getReq.onsuccess = (event) => {
      let entry = event.target.result;
      if (entry) {
        entry.viewed = !entry.viewed;
        const updateReq = auctionStore.put(entry);

        updateReq.onsuccess = function () {
          console.log("Updated db key: " + auctionId);
        };
      }
    };
  };
};

const addViewedButton = () => {
  const parent = document.querySelector("#divAuctionTotalList");
  const classes = ["text-center", "h2", "bg-secondary"];
  const customStyles = `cursor: pointer`;
  let viewedBtn = document.createElement("div");

  viewedBtn.setAttribute("style", customStyles);
  viewedBtn.id = "viewedButton";
  viewedBtn.classList.add(...classes);
  viewedBtn.innerText = "Not Viewed";

  const auctionId = getAuctionId();
  const req = window.indexedDB.open("capitalCityDb", 1);

  req.onsuccess = function (event) {
    const db = event.target.result;

    const transaction = db.transaction(["auctionStore"], "readwrite");
    const auctionStore = transaction.objectStore("auctionStore");

    const getReq = auctionStore.get(auctionId);
    getReq.onsuccess = function (event) {
      const viewed = event.target.result.viewed;
      if (viewed) {
        toggleViewedStyles(viewedBtn);
        viewedBtn.innerText = "Viewed";
      }
    };
  };

  parent.appendChild(viewedBtn);
  viewedBtn.addEventListener("click", function () {
    updateDbEntryViewedStatus();
    toggleViewedStyles(viewedBtn);
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
