const siteConfig = {
  applicationName: "CMPC",
  version: "",
  downloadFile: "CMPC (Run Launcher).zip",
  downloadPath: "downloads/CMPC (Run Launcher).zip",
  fileSizeBytes: 101524812,
  releaseDate: "",
};

const formatFileSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
const fileUrl = siteConfig.downloadPath
  .split("/")
  .map((part) => encodeURIComponent(part))
  .join("/");

document.querySelectorAll(".download-link").forEach((link) => {
  link.href = fileUrl;
  link.download = siteConfig.downloadFile;
  link.setAttribute("aria-disabled", "true");
});

document.getElementById("file-name").textContent = siteConfig.downloadFile;
document.getElementById("file-size").textContent = formatFileSize(siteConfig.fileSizeBytes);
document.getElementById("copyright-year").textContent = new Date().getFullYear();

if (siteConfig.version) {
  document.getElementById("file-version").textContent = siteConfig.version;
  document.getElementById("version-row").hidden = false;
}
if (siteConfig.releaseDate) {
  document.getElementById("release-date").textContent = siteConfig.releaseDate;
  document.getElementById("release-row").hidden = false;
}

const downloadStatus = document.getElementById("download-status");
fetch(fileUrl, { method: "HEAD" })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`The download returned HTTP ${response.status}.`);
    }

    const size = Number(response.headers.get("content-length"));
    if (Number.isFinite(size) && size > 0) {
      document.getElementById("file-size").textContent = formatFileSize(size);
      document.getElementById("file-detail").textContent = `Windows package · ZIP · ${formatFileSize(size)}`;
    } else {
      document.getElementById("file-detail").textContent = "Windows package · ZIP";
    }
    document.querySelectorAll(".download-link").forEach((link) => {
      link.removeAttribute("aria-disabled");
    });
    downloadStatus.textContent = "The CMPC ZIP is ready to download.";
  })
  .catch((error) => {
    document.querySelectorAll(".download-link").forEach((link) => {
      link.removeAttribute("href");
      link.removeAttribute("download");
    });
    downloadStatus.classList.add("error");
    downloadStatus.textContent = `Download unavailable: ${error.message} Please check back later.`;
  });

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.getElementById("primary-nav");
const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
