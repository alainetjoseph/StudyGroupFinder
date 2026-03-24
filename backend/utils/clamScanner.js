const NodeClam = require("clamscan");

let clam;

async function initClam() {
  if (!clam) {
    clam = await new NodeClam().init({
      clamdscan: {
        socket: "/var/run/clamav/clamd.ctl",
        timeout: 60000
      },
      preference: "clamdscan"
    });
  }
  return clam;
}

async function scanFile(filePath) {
  try {
    const scanner = await initClam();
    const data = await scanner.scanFile(filePath);
    console.log(data)
    return {
      infected: data.isInfected,
      viruses: data.viruses
    };
  } catch (err) {
    console.error("ClamAV error:", err);
    throw new Error("Virus scan failed");
  }
}

module.exports = scanFile;
