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

const setMarkers = () => {
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

document.addEventListener("DOMContentLoaded", [awaitLoadingCompleted()]);
