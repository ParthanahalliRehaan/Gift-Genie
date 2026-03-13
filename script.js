import { autoResizeTextarea, setLoading } from "./tool.mjs";

document.addEventListener("DOMContentLoaded", function() {  // WRAP IN THIS
  const giftForm = document.getElementById("gift-form");
  const userInput = document.getElementById("user-input");
  const outputContent = document.getElementById("output-content");

  function start() {
    userInput.addEventListener("input", () => autoResizeTextarea(userInput));
    giftForm.addEventListener("submit", handleGiftRequest);
  }

  async function handleGiftRequest(e) {
    e.preventDefault();
    const userPrompt = userInput.value.trim();
    if (!userPrompt) return;

    setLoading(true);

    try {
      const res = await fetch("/api/gift-genie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      outputContent.innerHTML = DOMPurify.sanitize(marked.parse(data.reply)) || DOMPurify.sanitize("No response");
    } catch (error) {
      console.error("Error:", error);
      outputContent.textContent = "Error - check console";
    } finally {
      setLoading(false);
    }
  }

  start();
});
