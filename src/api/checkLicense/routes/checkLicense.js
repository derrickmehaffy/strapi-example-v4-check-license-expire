module.exports = {
  routes: [
    {
      method: "GET",
      path: "/checkLicense",
      handler: "api::check-license.check-license.getLicense",
    },
  ],
};
