// Information to reach API
const apiUrl = "https://api.datamuse.com/words?";
const queryParams = "rel_syn=";
const inputField = document.querySelector("#input");
const submitButton = document.querySelector("#submit");
const responseField = document.querySelector("#responseField");

const fetchSuggestions = async (wordQuery) => {
  try {
    const endpoint = `${apiUrl}${queryParams}${wordQuery}`;
    const response = await fetch(endpoint, { cache: "no-cache" });

    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      throw new Error("Request failed!");
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const displaySuggestions = async (event) => {
  event.preventDefault();
  while (responseField.firstChild) {
    responseField.removeChild(responseField.firstChild);
  }

  const wordQuery = inputField.value;
  const suggestions = await fetchSuggestions(wordQuery);

  if (suggestions) {
    renderResponse(suggestions);
  } else {
    responseField.innerHTML =
      "<p>Try again! There were no suggestions found!</p>";
  }
};

submitButton.addEventListener("click", displaySuggestions);
inputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    displaySuggestions(event);
  }
});

// Formats response to look presentable on the webpage
const renderResponse = (res) => {
  if (res.length === 0) {
    responseField.innerHTML =
      "<p>Try again! There were no suggestions found!</p>";
    return;
  }

  const wordList = res
    .slice(0, 10)
    .map((item) => `<li>${item.word}</li>`)
    .join("");

  responseField.style.visibility = "visible";
  responseField.innerHTML = `<p>Words similar to ${inputField.value}:</p><ol>${wordList}</ol>`;
  inputField.value = "";
};
