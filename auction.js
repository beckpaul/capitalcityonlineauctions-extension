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
    return true
  }
  return false
}


const setMarkers = () => {
  const auctionItems = document.getElementsByClassName(
    "row pb-3 mt-2 border-bottom border auction-item-cardcolor"
  );

  Array.from(auctionItems).forEach((item) => {
    const itemInformation = item
      .querySelector(".tooltip-demos")
      .innerHTML.toLowerCase();

      if (itemIsNew(itemInformation)) {
        console.info("New item detected");
      }
  });
};
const setAuctionItemTooltips = () => {};
document.addEventListener("DOMContentLoaded", [
  // console.info("extension loaded"),
  awaitLoadingCompleted(),
]);
