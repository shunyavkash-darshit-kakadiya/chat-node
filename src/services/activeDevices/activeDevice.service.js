import activeDeviceModel from "../../models/activeDevice.model.js";
import generateCustomId from "../../utils/customID/generateCustomId.js";
import { customIdPrefix } from "../../constants/customIdPrefix.js";

// Store user device info during login
export async function createActiveDevice({
  AuthId,
  visitorId,
  browser,
  os,
  userAgent,
}) {
  let activeDevice = await activeDeviceModel.findOne({ AuthId, visitorId });

  if (!activeDevice) {
    activeDevice = new activeDeviceModel({
      AuthId,
      visitorId,
      browser,
      os,
      userAgent,
      customId: generateCustomId(customIdPrefix.activeDevice),
    });
  }

  activeDevice.AuthId = AuthId;
  activeDevice.visitorId = visitorId;
  activeDevice.browser = browser;
  activeDevice.os = os;
  activeDevice.userAgent = userAgent;

  await activeDevice.save();
}

// Remove a specific device session by visitorId
export async function removeActiveDevice(visitorId) {
  return activeDeviceModel.findOneAndDelete({ visitorId });
}

// Remove all device sessions for a user
export async function removeAllActiveDevices(AuthId) {
  return activeDeviceModel.deleteMany({ AuthId });
}

// Get active device for auth validation
export async function getActiveDevice(AuthId, visitorId) {
  return activeDeviceModel.findOne({ AuthId, visitorId });
}
