function convert24to12(time24: string) {
  // Split the time string into hours and minutes
  const [hours, minutes] = time24.split(":").map(Number);

  // Determine AM/PM
  const period = hours >= 12 ? "PM" : "AM";

  // Adjust hours for 12-hour format
  let hours12 = hours % 12;
  if (hours12 === 0) {
    hours12 = 12;
  }

  // Format the 12-hour time string
  const time12 = `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;

  return time12;
}

export const getTimenow = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time12 = convert24to12(`${hours}:${minutes}`);
  return time12;
};
