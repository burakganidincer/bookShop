let bookList = [];
basketList = [];

function toggleMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.toggle("active");
}

const toggleModal = () => {
  const basketModal = document.querySelector(".basket__modal");
  basketModal.classList.toggle("active");
};
//verileri çekme
const getBooks = async () => {
  try {
    const response = await fetch("./product.json");
    const data = await response.json();
    bookList = data;
  } catch (error) {
    console.log(error);
  }
};
getBooks();
// dinamik starlar
const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += ` <i class="bi bi-star-fill active"></i>`;
    } else starRateHtml += ` <i class="bi bi-star-fill"></i>`;
  }
  return starRateHtml;
};
//ekrana verileri yazdırmak
const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book__list");
  let bookListHtml = "";
  console.log(bookList);
  bookList.forEach((book, index) => {
    bookListHtml += `
         <div class="col-md-6 col-lg-4 my-2 ${index % 2 == 0 && "offset-2"}"">
          <div class="row book__card">
            <div class="col-md-6">
              <img
                src="${book.imgSource}"
                class="shadow img-fluid"
                width="258px"
                height="400px"
              />
            </div>
            <div class="col-md-6 d-flex flex-column justify-content-center gap-4">
              <div class="book__detail">
                <p class="fs-5 gray">${book.author}</p>
                <p class="fs-4 fw-bold">${book.name}</p>
                <span class="book__star-rate">
                  ${createBookStars(book.starRate)}
                  <span>${book.reviewCount}ziyaret</span>
                </span>
              </div>
              <p class="book__description gray">
                ${book.description}
              </p>
              <div>
                <span class="black fw-bold fs-4 me-2">${book.price}₺</span>
                ${
                  book.oldPrice
                    ? `   <span class="fs-4 fw-bold old__price">${book.oldPrice} ₺</span> `
                    : ""
                }
              </div>
              <button class="btn__purple" onClick='addBookToBasket(${
                book.id
              })' >Sepete Ekle</button>
            </div>
          </div>
        </div>
        `;
  });
  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  HISTORY: "Tarih",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
};

const createBookTypesHtml = () => {
  //filtreleme elemanı seç
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["All"];
  bookList.forEach((book) => {
    //filtre türleri dizisinde istenen tür bulunmuyorsa ekle
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });
  //her filtre türü için hmtl oluşturma
  filterTypes.forEach((type, index) => {
    filterHtml += `<li onClick="filterBooks(this)" data-types=${type} class=${
      index == 0 ? "active" : null
    }>${BOOK_TYPES[type] || type}</li>`;
  });
  filterEle.innerHTML = filterHtml;
};
const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.types;
  getBooks();
  if (bookType != "ALL") {
    bookList = bookList.filter((book) => book.type == bookType);
    createBookItemsHtml();
  }
};

const decreaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  console.log(findedIndex);
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
    }
    listBasketItems();
  }
};
const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );

  if (findedIndex != -1) {
    if (
      basketList[findedIndex].quantity != basketList[findedIndex].product.stock
    ) {
      basketList[findedIndex].quantity += 1;
    } else {
      alert("Yeterince stok yok");
    }
    listBasketItems();
  }
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket__list");
  const basketCountEl = document.querySelector(".basket__count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    basketListHtml += `
    <li class="basket__item">
    <img
      src="${item.product.imgSource}"
      width="100"
      height="100"
      alt=""
    />
    <div class="basket__item-info ms-2">
      <h2 class="book__name">${item.product.name}]</h2>
      <span>${item.product.price} ₺</span>
      <p class="book__remove" onClick="removeItemFromBasket(${item.product.id})">remove</p>
    </div>
    <div class="book__count">
      <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
      <span class="">${item.quantity}</span>
      <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>`;
  });
  basketListEl.innerHTML = basketListHtml;
};

const displayTotalPrice = () => {
  let totalPrice = 0;
  basketList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
  });
  const totalPriceEl = document.querySelector(".total__price");
  totalPriceEl.textContent = `Toplam Fiyat: ${totalPrice.toFixed(2)} ₺`;
};

const addBookToBasket = (bookId) => {
  console.log(bookId);
  let findedBook = bookList.find((book) => book.id == bookId);
  if (findedBook) {
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketAlreadyIndex == -1) {
      let addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
      console.log(basketList);
    } else {
      basketList[basketAlreadyIndex].quantity += 1;
      console.log(basketList);
    }
    listBasketItems();
    displayTotalPrice();
  }
};
const removeItemFromBasket = (bookId) => {
  // Sepetteki ürünün dizindeki indeksini bul
  const indexToRemove = basketList.findIndex(
    (item) => item.product.id === bookId
  );

  // Eğer ürün bulunduysa, sepetten kaldır
  if (indexToRemove !== -1) {
    basketList.splice(indexToRemove, 1); // Ürünü listeden kaldır

    // Sepet öğelerini yeniden listele
    listBasketItems();

    // Toplam fiyatı güncelle
    displayTotalPrice();
  }
};

//0.2 saniye ekle
setTimeout(() => {
  createBookItemsHtml();
  createBookTypesHtml();
}, 200);
