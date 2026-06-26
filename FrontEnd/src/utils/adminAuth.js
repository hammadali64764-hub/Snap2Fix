export const isAdminLoggedIn = () => {
  return localStorage.getItem("administratorLoggedIn") === "true";
};


export const logoutAdmin = () => {
  localStorage.removeItem("administratorLoggedIn");
  localStorage.removeItem("administratorId");
};
