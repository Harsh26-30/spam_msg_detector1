const form = document.getElementById("spamForm");
const input = document.getElementById("msg");
const result = document.getElementById("result");
const resultBox = document.getElementById("resultBox");
const resultIcon = document.getElementById("resultIcon");
const detectBtn = document.getElementById("detectBtn");
const btnText = detectBtn.querySelector(".btn-text");
const count = document.getElementById("count");

// Update the result card (state: "idle" | "spam" | "ham" | "error")
function showResult(state, text, icon) {
    resultBox.classList.remove("spam", "ham", "error");
    if (state !== "idle") {
        resultBox.classList.add(state);
    }
    result.textContent = text;
    resultIcon.textContent = icon;
}

// Character counter
input.addEventListener("input", function () {
    count.textContent = input.value.length;
});

// Example chips
document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
        input.value = chip.dataset.example;
        count.textContent = input.value.length;
        input.focus();
    });
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) {
        showResult("error", "Please enter a message first.", "!");
        return;
    }

    // Loading state
    detectBtn.disabled = true;
    detectBtn.classList.add("loading");
    btnText.textContent = "Checking...";
    showResult("idle", "Checking...", "…");

    try {
        const response = await axios.post(
            "http://127.0.0.1:5000/predict",
            { message: message }
        );

        // Display the Python model's prediction in HTML
        if (response.data.prediction === '1') {
            showResult("spam", "Spam - this message looks suspicious.", "✕");
        } else {
            showResult("ham", "Ham - this message looks safe.", "✓");
        }

    } catch (error) {
        showResult("error", "Error: Could not get prediction.", "!");
        console.error(error);
    } finally {
        detectBtn.disabled = false;
        detectBtn.classList.remove("loading");
        btnText.textContent = "Detect";
    }
});
