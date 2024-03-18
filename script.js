const COHORT = "2401-ftb-et-web-am";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-ftb-et-web-am/events`;

const state = {
  events: [],
};

const eventsList = document.querySelector("#parties");
const addEventForm = document.querySelector("#addParty");
addEventForm.addEventListener("submit", addEvent);

//fetch API data
async function fetchEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}
fetchEvents();

async function render() {
  await fetchEvents();
  renderEvents();
}
render();

// Using the POST method to create new events
async function createEvent(name, description, location, date) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, location, date }),
    });
    const json = await response.json();
    console.log("new party", json);

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

// adding a party by awaiting for the promises name, description, and location
async function addEvent(event) {
  event.preventDefault();
  await createEvent(
    addEventForm.name.value,
    addEventForm.description.value,
    addEventForm.location.value,

    new Date(addEventForm.date.value)
  );
}

// Rendering events by returning innerHTML or by cards holding each event added with innerHTML including a delete button
function renderEvents() {
  if (!state.events.length) {
    eventsList.innerHTML = `<li>No events found.</li>`;
    return;
  }

  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("event");
    eventCard.innerHTML = `
        <h2>${event.name}</h2>
        
        <p>${event.description}</p>
      `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    eventCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return eventCard;
  });
  eventsList.replaceChildren(...eventCards);
}

// DELETE Method
async function deleteEvent(id) {
  try {
    console.log(id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Party could not be deleted.");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}
