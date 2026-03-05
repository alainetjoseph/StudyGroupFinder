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
    const { isInfected, viruses } = await scanner.scanFile(filePath);

    return {
      infected: isInfected,
      viruses
    };
  } catch (err) {
    console.error("ClamAV error:", err);
    throw new Error("Virus scan failed");
  }
}

module.exports = scanFile;
