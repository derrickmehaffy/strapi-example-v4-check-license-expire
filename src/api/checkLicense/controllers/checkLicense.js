const { verifyLicense } = require("@strapi/strapi/ee/license");
const { join } = require("path");
const fse = require("fs-extra");

module.exports = {
  async getLicense(ctx) {
    // Checking for license.txt file
    const licensePath = join(strapi.dirs.app.root, "license.txt");
    const licenseFileExists = await fse.existsSync(licensePath);

    // Init main vars
    let license;
    let licenseKey;
    let lastCheckedAt;

    // Check if online or offline license
    if (process.env.STRAPI_DISABLE_LICENSE_PING === "true") {
      // Check for env var
      if (process.env.STRAPI_LICENSE) {
        licenseKey = process.env.STRAPI_LICENSE;
        // Check for license.txt file
      } else if (licenseFileExists == true) {
        licenseKey = await fse.readFileSync(licensePath).toString();
      }
    } else {
      // Fallback to online license
      license = await strapi.db
        .query("strapi::core-store")
        .findMany({ where: { key: "ee_information" } });
      licenseKey = JSON.parse(license[0].value).license;
    }

    // If online, grab the last checked at date
    if (license) {
      lastCheckedAt = new Date(
        JSON.parse(license[0].value).lastCheckAt
      ).toLocaleDateString("en-ZA");
    }

    // Verify the license and get the license info
    const licenseInfo = await verifyLicense(licenseKey);

    // Return the info you need
    return {
      type: licenseInfo.type,

      // Note that if using online license verification the expireAt should be +2 days from lastCheckedAt
      // Else if offline license then lastCheckedAt won't exist
      lastCheckedAt,
      expireAt: new Date(licenseInfo.expireAt).toLocaleDateString("en-ZA"),
    };
  },
};
