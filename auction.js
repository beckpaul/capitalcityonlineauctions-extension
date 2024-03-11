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
    }
  };

  checkLoadingIconVisibility();
};

const itemIsNew = (info) => {
  if (info.includes("item is new")) {
    return true;
  }
  return false;
};

const itemStatuses = {
  "item is new": true,
  "This bulk item is sold as-is, and NO REFUNDS will be issued": true,
  "Item Is In Retail Packaging. This Item Is Sold As-Is.": true,
  "item is open box": true,
};

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
  var newItemMarker = document.createElement("div");
  newItemMarker.textContent = textContent;

   var classes = ["btn", "pt-2", "text-center"];
   classes.push(background);

  newItemMarker.classList.add(...classes);
  const elementToInsertBefore = element.querySelector(".tooltip-demos");
  elementToInsertBefore.parentElement.insertBefore(
    newItemMarker,
    elementToInsertBefore
  );
};

const setMarkers = () => {
  const auctionItems = document.getElementsByClassName(
    "row pb-3 mt-2 border-bottom border auction-item-cardcolor"
  );

  Array.from(auctionItems).forEach((item) => {
    const itemInformation = item
      .querySelector(".tooltip-demos")
      .innerHTML.toLowerCase();

    const itemStatus = getItemStatus(itemInformation);
    var background = "";

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

const setAuctionItemTooltips = () => {};
document.addEventListener("DOMContentLoaded", [
  // console.info("extension loaded"),
  awaitLoadingCompleted(),
]);
