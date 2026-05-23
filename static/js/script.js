let selectedCategory = "";
let selectedSector = "";

let currentPage = 1;

let historyStack = [];

let selectedLocations = [];

let lastQuery = "";
let lastFilters = {};

function showMainSelection() {
  const hero = document.querySelector(".hero-section");

  hero.style.opacity = "0";

  hero.style.transform = "translateY(-100px)";

  hero.style.transition = "0.8s";

  setTimeout(() => {
    hero.style.display = "none";

    document.getElementById("mainContainer").classList.remove("hidden");

    renderHomeSelection();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 700);
}

function updatePage(html) {
  clearResults();

  const container = document.getElementById("dynamicContent");

  historyStack.push(container.innerHTML);

  container.innerHTML = html;

  document.getElementById("backBtn").classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function clearResults() {
  document.getElementById("resultsContainer").innerHTML = "";

  document.getElementById("paginationBox").classList.add("hidden");
}

function goBack() {
  clearResults();

  if (historyStack.length > 0) {
    const previous = historyStack.pop();

    document.getElementById("dynamicContent").innerHTML = previous;
  }

  if (historyStack.length === 0) {
    document.getElementById("backBtn").classList.add("hidden");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function renderHomeSelection() {
  const html = `

        <div class="center-box">

            <h1>
                What are you looking for?
            </h1>

            <div class="selection-buttons">

                <button onclick="
                    selectCategory('Internship')
                ">
                    Internships
                </button>

                <button onclick="
                    selectCategory('Job')
                ">
                    Job Opportunities
                </button>

            </div>

        </div>
    `;

  document.getElementById("dynamicContent").innerHTML = html;
}

function selectCategory(category) {
  selectedCategory = category;

  const html = `

        <div class="center-box">

            <h1>
                Choose Your Way
            </h1>

            <div class="selection-buttons">

                <button onclick="
                    selectSector('IT')
                ">
                    IT
                </button>

                <button onclick="
                    selectSector('Non-IT')
                ">
                    Non-IT
                </button>

            </div>

        </div>
    `;

  updatePage(html);
}

function selectSector(sector) {
  selectedSector = sector;

  if (selectedCategory === "Internship") {
    renderInternshipPage();
  } else {
    renderJobPage();
  }
}

function renderInternshipPage() {
  const html = `

        <div class="search-page">

            <h1>
                Internship Search
            </h1>

            <input
                type="text"
                id="internshipInput"
                class="search-box"
                placeholder="
                Search internships...
                "
            >

            <div class="filters-box">

                <h2>
                    Filters
                </h2>

                <div class="filters-grid">

                    <select id="modeFilter">

                        <option value="">
                            Mode
                        </option>

                        <option>
                            Online
                        </option>

                        <option>
                            Offline
                        </option>

                    </select>


                    <select id="typeFilter">

                        <option value="">
                            Type
                        </option>

                        <option>
                            Paid
                        </option>

                        <option>
                            Free
                        </option>

                        <option>
                            Stipend
                        </option>

                    </select>


                    <select id="durationFilter">

                        <option value="">
                            Duration
                        </option>

                        <option>
                            1 Month
                        </option>

                        <option>
                            3 Months
                        </option>

                        <option>
                            6 Months
                        </option>

                    </select>


                    <select id="locationFilter">

                        <option value="">
                            Location
                        </option>

                        <option>
                            Hyderabad
                        </option>

                        <option>
                            Bangalore
                        </option>

                        <option>
                            Chennai
                        </option>

                        <option>
                            Vizag
                        </option>

                        <option>
                            Mumbai
                        </option>

                        <option>
                            Kolkata
                        </option>

                        <option>
                            Andhra Pradesh
                        </option>

                        <option>
                            Telangana
                        </option>

                    </select>

                </div>

            </div>

            <button class="start-btn"
                    onclick="searchInternships()">

                Search Internships

            </button>

        </div>
    `;

  updatePage(html);
}

function renderJobPage() {
  const html = `

        <div class="search-page">

            <h1>
                Job Search
            </h1>

            <input
                type="text"
                id="jobInput"
                class="search-box"
                placeholder="
                Search jobs...
                "
            >

            <h2 class="location-title">

                Select Locations

            </h2>

            <div class="multi-locations">

                ${generateLocationChips()}

            </div>

            <button class="start-btn"
                    onclick="searchJobs()">

                Search Jobs

            </button>

        </div>
    `;

  updatePage(html);
}

function generateLocationChips() {
  const locations = [
    "Hyderabad",
    "Bangalore",
    "Chennai",
    "Mumbai",
    "Kolkata",
    "Vizag",
    "Andhra Pradesh",
    "Telangana",
  ];

  let chips = "";

  locations.forEach((location) => {
    chips += `

            <div class="
                location-chip
            "
            onclick="
                toggleLocation(
                    this,
                    '${location}'
                )
            ">

                ${location}

            </div>
        `;
  });

  return chips;
}

function toggleLocation(element, location) {
  element.classList.toggle("active");

  if (selectedLocations.includes(location)) {
    selectedLocations = selectedLocations.filter((item) => item !== location);
  } else {
    selectedLocations.push(location);
  }
}

function searchInternships() {
  currentPage = 1;

  const query = document.getElementById("internshipInput").value;

  const filters = {
    mode: document.getElementById("modeFilter").value,

    type: document.getElementById("typeFilter").value,

    duration: document.getElementById("durationFilter").value,

    location: document.getElementById("locationFilter").value,
  };

  lastQuery = query;
  lastFilters = filters;

  fetchResults(query, filters);
}

function searchJobs() {
  currentPage = 1;

  const query = document.getElementById("jobInput").value;

  const filters = {
    locations: selectedLocations,
  };

  lastQuery = query;
  lastFilters = filters;

  fetchResults(query, filters);
}

async function fetchResults(query, filters) {
  const loader = document.getElementById("loaderSection");

  loader.classList.remove("hidden");

  clearResults();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  try {
    const response = await fetch("/search", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        category: selectedCategory,

        sector: selectedSector,

        role: query,

        filters: filters,

        page: currentPage,
      }),
    });

    const data = await response.json();

    loader.classList.add("hidden");

    displayResults(data);
  } catch (error) {
    loader.classList.add("hidden");

    document.getElementById("resultsContainer").innerHTML = `

            <h2 class="error-text">

                Failed To Load Results

            </h2>
        `;
  }
}

function displayResults(data) {
  const container = document.getElementById("resultsContainer");

  container.innerHTML = "";

  if (data.length > 0) {
    document.getElementById("paginationBox").classList.remove("hidden");
  } else {
    container.innerHTML = `

            <h2 class="error-text">

                No Opportunities Found

            </h2>
        `;

    return;
  }

  data.forEach((item, index) => {
    const card = document.createElement("div");

    card.className = "horizontal-card";

    card.innerHTML = `

            <div class="card-top">

                <div class="left-info">

                    <h2>
                        ${item.company}
                    </h2>

                    <p>
                        ${item.role}
                    </p>

                    <p>
                        📍 ${item.location}
                    </p>

                    <p>
                        💰 ${item.salary || item.stipend}
                    </p>

                </div>

                <button onclick="
                    toggleDetails(${index})
                ">
                    View Details
                </button>

            </div>

            <div class="
                details hidden
            "
            id="details-${index}">

                <p>
                    ${item.short_description}
                </p>

                <br>

                <p>
                    Qualification:
                    ${item.qualification}
                </p>

                <br>

                <p>
                    Experience:
                    ${item.experience}
                </p>

                <br>

                <a href="
                    ${item.apply_link}
                "
                target="_blank">

                    <button>
                        Apply Now
                    </button>

                </a>

            </div>
        `;

    container.appendChild(card);
  });

  window.scrollTo({
    top: 250,
    behavior: "smooth",
  });
}

function toggleDetails(index) {
  document.getElementById(`details-${index}`).classList.toggle("hidden");
}

function nextPage() {
  currentPage++;

  fetchResults(lastQuery, lastFilters);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;

    fetchResults(lastQuery, lastFilters);
  }
}
