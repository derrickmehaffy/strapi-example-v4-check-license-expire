const { verifyLicense } = require("@strapi/strapi/ee/license");

module.exports = {
  async getLicense(ctx) {
    // Fetch the license key from the cache on the server
    const license = await strapi.db
      .query("strapi::core-store")
      .findMany({ where: { key: "ee_information" } });

    // Grab the actual key and checked date
    const licenseKey = JSON.parse(license[0].value).license;
    const lastCheckedAt = JSON.parse(license[0].value).lastCheckAt;

    // Verify the license and get the license info
    const licenseInfo = await verifyLicense(licenseKey);

    // Return the info you need
    return {
      type: licenseInfo.type,

      // Note that if using online license verification the expireAt should be +2 days from lastCheckedAt
      lastCheckedAt: new Date(lastCheckedAt).toLocaleDateString("en-ZA"),
      expireAt: new Date(licenseInfo.expireAt).toLocaleDateString("en-ZA"),
    };
  },
};
