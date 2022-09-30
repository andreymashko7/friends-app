const rootRef = document.querySelector(".main__cards");
const form = document.querySelector(".main__form");
const bodyRef = document.querySelector("body");
let filterAndSortAtr, friends, filteredOrSort;
let copyFriends = [];

async function fetchUsers() {
	const response = await fetch(
		`https://randomuser.me/api/?results=20&noinfo`
	);
	return await response.json();
}

try {
	friends = await fetchUsers();
	copyFriends = [...friends.results];
} catch (error) {
	console.log(error.message);
}

let sliceFriends = [];

function sliceBestMatch(arrOfFriends) {
	sliceFriends.length = 0;
	for (let i = 0; i < arrOfFriends.length; i++) {
		if (i === 8) {
			break;
		}
		sliceFriends.push(arrOfFriends[i]);
	}
	return sliceFriends;
}

let defaultFriends = sliceBestMatch(copyFriends);

function renderCardsMarkup(friends) {
	return friends
		.map(
			({ email, cell, name, picture, dob }) =>
				`<div class="card">
                    <div>
                        <img
                        class="card__img"
	                    src=${picture.large}
	                    alt=""
	                    />
                    </div> 
                        <div class="card__description">
		                <p class="card__title">${name.first} ${name.last}</p>
		                <p class="card__email">${email}</p>
		                <p class="card__phone">${cell}</p>
                        <span class="card__age">${dob.age}</span>
	                </div>
                </div>`
		)
		.join("");
}

rootRef.innerHTML = renderCardsMarkup(defaultFriends);

function getSortFriends(friends, filterAndSortAtr) {
	return friends.sort((a, b) => {
		switch (filterAndSortAtr) {
			case "ascending-age":
				return a.dob.age - b.dob.age;
			case "descending-age":
				return b.dob.age - a.dob.age;
			case "descending-name":
				return b.name.first.localeCompare(a.name.first);
			case "ascending-name":
				return a.name.first.localeCompare(b.name.first);
			default:
				return friends;
		}
	});
}

function getfilterByGender(friends, filterAndSortAtr) {
	return friends.filter((friend) => {
		switch (filterAndSortAtr) {
			case "all":
				return friends;
			case "male":
				return friend.gender === "male";
			case "female":
				return friend.gender === "female";
			default:
				return friends;
		}
	});
}

const formSort = document.querySelector(".form__sort");
const formGender = document.querySelector(".form__gender");
formSort.addEventListener("click", handleClick);
formGender.addEventListener("click", handleClick);

function handleClick({ target }) {
	filterAndSortAtr = target.dataset.sort;

	if (target.nodeName !== "IMG" && target.nodeName !== "INPUT") {
		return;
	}

	if (
		filterAndSortAtr === "all" ||
		filterAndSortAtr === "male" ||
		filterAndSortAtr === "female"
	) {
		mainFormInput.value = "";
		filteredOrSort = getfilterByGender(copyFriends, filterAndSortAtr);
	} else {
		clearFilters();
		filteredOrSort = getSortFriends(copyFriends, filterAndSortAtr);
	}
	rootRef.innerHTML = renderCardsMarkup(sliceBestMatch(filteredOrSort));
}

const btnRef = document.querySelector(".form__clear");
btnRef.addEventListener("click", clearFilters);

function clearFilters() {
	mainForm.nameRadio[0].checked = true;
	mainFormInput.value = "";
	rootRef.innerHTML = renderCardsMarkup(sliceBestMatch(copyFriends));
}

const mainForm = document.forms.form;
mainForm.addEventListener("submit", (event) => {
	event.preventDefault();
});

const mainFormInput = mainForm.nameInput;
mainFormInput.addEventListener("input", findByName);

function findByName(event) {
	const inputText = event.target.value.toLowerCase();
	const friendsByName = copyFriends.filter((friend) =>
		friend.name.first.toLowerCase().includes(inputText)
	);
	if (!friendsByName.length) {
		rootRef.innerHTML = "<div class='notification'>No friends found</div>";
		return;
	}
	mainForm.nameRadio[0].checked = true;
	rootRef.innerHTML = renderCardsMarkup(sliceBestMatch(friendsByName));
}

const filterRef = document.querySelector(".form-filter");
filterRef.addEventListener("click", function ({ target }) {
	console.log(target);
	if (target.nodeName !== "DIV") {
		return;
	}
	form.classList.toggle("show");

	// const modal = document.querySelector("[data-modal]");
	// modal.classList.toggle("is-hidden");

	// bodyRef.classList.toggle("body-bg");
	filterRef.textContent = "close filter";
	if (!form.classList.contains("show")) {
		filterRef.textContent = "open filter";
	}
});
