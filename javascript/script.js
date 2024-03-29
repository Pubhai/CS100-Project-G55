// File: script.js
// Author: CS100 Team
// Date Created: 23 July 2023
// Copyright: CSTU
// Description: JS code of CSTU Passport that validates with JS

const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

// Function to validate Firstname and Lastname
function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const names = fullnameInput.value.trim().split(" ");
  const errorElement = document.getElementById("fullnameError");

  if (names.length !== 2) {
    errorElement.textContent = "Please enter both your Firstname and Lastname.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate Student ID
function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^\d{10}$/;
  const errorElement = document.getElementById("studentIDError");

  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter a 10-digit Student ID.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate University Email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");

  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate form inputs on user input
function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
  // Add additional validation functions for other form fields if needed
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

// Function to handle type of work/activity change
function handleTypeOfWorkChange() {
  const activityTypeSelect = document.getElementById("activityType");

  // Validate that the user selects a type of work/activity
  if (activityTypeSelect.value === "") {
    alert("Please select a type of work/activity.");
    // You may want to reset the selection or display an error message
  }
}

// Function to handle start date change
function handleStartDateChange() {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  // Validate that end date is after start date
  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    // You may want to reset the end date or display an error message
  }
}

// Function to handle end date change
function handleEndDateChange() {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  // Validate that end date is after start date
  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    // You may want to reset the end date or display an error message
  }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

// Function to submit the form
async function submitForm(event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert("End datetime should be after the start datetime.");
    return;
  }

  // Create the data object to send to the backend
  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description"),
  };

  console.log(data);

  try {
    // Send data to the backend using POST request
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      // Customize the displayed user data
      const userName = `${data.first_name} ${data.last_name}`;
      const userStudentID = data.student_id;
      const userEmail = data.email;

      // Work/Activity details
      const workTitle = data.title;
      const typeOfWork = data.type_of_work_id; // Assuming this is an ID, you might want to map it to a human-readable type
      const academicYear = data.academic_year + 543; // Convert back to the actual academic year
      const semester = data.semester;
      const startDateTime = data.start_date;
      const endDateTime = data.end_date;
      const location = data.location;
      const description = data.description;

      // Display success message with formatted user data
      alert(`Thank you, ${userName}! Your form has been successfully submitted.`);

      // Reset the form
      document.getElementById("myForm").reset();

      // Display the user data underneath the form in a styled container
      document.getElementById('resultContainer').innerHTML = `
        <div class="result-container">
          <h2>Submitted User Data:</h2>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Student ID:</strong> ${userStudentID}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Work/Activity Title:</strong> ${workTitle}</p>
          <p><strong>Type of Work/Activity:</strong> ${typeOfWork}</p>
          <p><strong>Academic Year:</strong> ${academicYear}</p>
          <p><strong>Semester:</strong> ${semester}</p>
          <p><strong>Start Date/Time:</strong> ${startDateTime}</p>
          <p><strong>End Date/Time:</strong> ${endDateTime}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Description:</strong> ${description}</p>
        </div>
      `;
    } else {
      console.error("Failed to submit form data.");

      // Display error message
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
}

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);

// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document
  .getElementById("studentID")
  .addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);

// Add event listeners for the new events
document.getElementById("startDate").addEventListener("change", handleStartDateChange);
document.getElementById("endDate").addEventListener("change", handleEndDateChange);
document.getElementById("activityType").addEventListener("change", handleTypeOfWorkChange);