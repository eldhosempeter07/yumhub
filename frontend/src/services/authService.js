const authService = {
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
