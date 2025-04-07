document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch activities from the API
  fetch("/activities")
    .then((response) => response.json())
    .then((activities) => {
      activitiesList.innerHTML = ""; // Clear the loading message
      Object.keys(activities).forEach((activityName) => {
        const activity = activities[activityName];

        // Create activity card
        const activityCard = document.createElement("div");
        activityCard.classList.add("activity-card");

        // Add activity details
        activityCard.innerHTML = `
          <h4>${activityName}</h4>
          <p><strong>Description:</strong> ${activity.description}</p>
          <p><strong>Schedule:</strong> ${activity.schedule}</p>
          <p><strong>Max Participants:</strong> ${activity.max_participants}</p>
          <p><strong>Participants:</strong></p>
          <ul class="participants-list">
            ${activity.participants
              .map((participant) => `<li>${participant}</li>`)
              .join("")}
          </ul>
        `;

        // Append activity card to the list
        activitiesList.appendChild(activityCard);

        // Add activity to the dropdown
        const option = document.createElement("option");
        option.value = activityName;
        option.textContent = activityName;
        activitySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching activities:", error);
      activitiesList.innerHTML = "<p class='error'>Failed to load activities.</p>";
    });

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
