// Estado da aplicação
let currentPath = "root";
let currentPreviewFile = null;
let fileStructure = {}; 

let files = [];
let selectedFiles = [];
let viewMode = "grid";

// Elementos DOM
const elements = {
    fileContainer: document.getElementById("file-container"),
    breadcrumbPath: document.getElementById("breadcrumb-path"),
    gridViewBtn: document.getElementById("grid-view"),
    listViewBtn: document.getElementById("list-view"),
    selectAllBtn: document.getElementById("select-all"),
    clearSelectionBtn: document.getElementById("clear-selection"),
    downloadSelectedBtn: document.getElementById("download-selected"),
    selectionInfo: document.getElementById("selection-info"),
    selectionCount: document.getElementById("selection-count"),
    selectionSize: document.getElementById("selection-size"),
    previewModal: document.getElementById("preview-modal"),
    previewTitle: document.getElementById("preview-title"),
    previewContent: document.getElementById("preview-content"),
    closePreview: document.getElementById("close-preview"),
    downloadPreview: document.getElementById("download-preview"),
};

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    initializeEventListeners();
    loadAndRenderFileStructure();
});

function initializeEventListeners() {
    if (elements.gridViewBtn) elements.gridViewBtn.addEventListener("click", () => setViewMode("grid"));
    if (elements.listViewBtn) elements.listViewBtn.addEventListener("click", () => setViewMode("list"));
    if (elements.selectAllBtn) elements.selectAllBtn.addEventListener("click", selectAll);
    if (elements.clearSelectionBtn) elements.clearSelectionBtn.addEventListener("click", clearSelection);
    if (elements.downloadSelectedBtn) elements.downloadSelectedBtn.addEventListener("click", downloadSelected);
    if (elements.closePreview) elements.closePreview.addEventListener("click", closePreview);

    if (elements.previewModal) {
        elements.previewModal.addEventListener("click", (e) => {
            if (e.target === elements.previewModal) closePreview();
        });
    }
}

async function loadAndRenderFileStructure() {
    try {
        const response = await fetch("file_structure.json");
        if (!response.ok) throw new Error("Erro ao carregar file_structure.json");
        
        fileStructure = await response.json();
        calculateFolderSizes();
        
        // Define o caminho inicial como 'root'
        loadFilesFromPath("root");
    } catch (error) {
        console.error("Erro:", error);
        displayEmptyState("Erro ao carregar a estrutura de arquivos.");
    }
}

function calculateFolderSizes() {
    function calculateSizeForPath(path) {
        let currentTotalSize = 0;
        const currentEntry = fileStructure[path];

        if (currentEntry && currentEntry.files) {
            currentEntry.files.forEach(file => {
                currentTotalSize += file.size || 0;
            });
        }

        if (currentEntry && currentEntry.folders) {
            currentEntry.folders.forEach(folder => {
                const folderPath = folder.id;
                if (fileStructure[folderPath] && fileStructure[folderPath].totalSize === undefined) {
                    calculateSizeForPath(folderPath);
                }
                currentTotalSize += fileStructure[folderPath]?.totalSize || 0;
            });
        }
        if (currentEntry) {
            currentEntry.totalSize = currentTotalSize;
        }
        return currentTotalSize;
    }

    Object.keys(fileStructure).forEach(path => {
        if (fileStructure[path].totalSize === undefined) {
            calculateSizeForPath(path);
        }
    });
}

function getFolderSize(path) {
    return fileStructure[path]?.totalSize || 0;
}

function loadFilesFromPath(path) {
    currentPath = path;
    const entry = fileStructure[path];
    
    if (entry) {
        files = [
            ...(entry.folders || []).map(f => ({...f, isDirectory: true})),
            ...(entry.files || [])
        ];
    } else {
        files = [];
    }
    
    selectedFiles = [];
    updateBreadcrumb();
    renderFiles();
}

function updateBreadcrumb() {
    if (currentPath === "root") {
        elements.breadcrumbPath.innerHTML = "<span onclick=\"loadFilesFromPath('root')\" style='cursor:pointer; color:#3b82f6;'>database</span>";
    } else {
        let html = "<span onclick=\"loadFilesFromPath('root')\" style='cursor:pointer; color:#3b82f6;'>database</span>";
        const parts = currentPath.split("/");
        let pathBuild = "";
        parts.forEach(part => {
            if (part && part !== "root") {
                pathBuild += (pathBuild ? "/" : "") + part;
                html += ` / <span onclick="loadFilesFromPath('${pathBuild}')" style='cursor:pointer; color:#3b82f6;'>${part}</span>`;
            }
        });
        elements.breadcrumbPath.innerHTML = html;
    }
}

function displayEmptyState(message = "Nenhum arquivo encontrado.") {
    elements.fileContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #999;">
            <div style="font-size: 48px; margin-bottom: 20px;">📁</div>
            <h2 style="color: #666; margin: 0 0 10px 0;">Vazio</h2>
            <p style="margin: 0; font-size: 14px;">${message}</p>
        </div>
    `;
}

function renderFiles() {
    elements.fileContainer.innerHTML = "";

    if (files.length === 0) {
        displayEmptyState();
        return;
    }

    if (viewMode === "grid") {
        const grid = document.createElement("div");
        grid.className = "file-grid";
        files.forEach(file => {
            const card = document.createElement("div");
            card.className = `file-card ${file.isDirectory ? "directory" : ""} ${selectedFiles.includes(file.id) ? "selected" : ""}`;
            
            let content = "";
            if (file.isDirectory) {
                const size = getFolderSize(file.id);
                content = `
                    <div class="file-icon">${getFileIcon(file)}</div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-info">${formatFileSize(size)}</div>
                `;
            } else {
                const preview = (file.type === "image" && file.preview) 
                    ? `<div class="file-preview"><img src="${file.preview}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Ctext x=%2212%22 y=%2216%22 text-anchor=%22middle%22 font-size=%2210%22 fill=%22%23999%22%3E?%3C/text%3E%3C/svg%3E'"></div>`
                    : `<div class="file-icon">${getFileIcon(file)}</div>`;
                content = `
                    ${preview}
                    <div class="file-name">${file.name}</div>
                    <div class="file-info">${formatFileSize(file.size)}</div>
                `;
            }
            
            card.innerHTML = `<input type="checkbox" class="file-checkbox" ${selectedFiles.includes(file.id) ? "checked" : ""}>${content}`;
            card.onclick = (e) => handleFileClick(file, e);
            grid.appendChild(card);
        });
        elements.fileContainer.appendChild(grid);
    } else {
        const table = document.createElement("table");
        table.className = "file-list";
        let tbody = "<tbody>";
        files.forEach(file => {
            const size = file.isDirectory ? getFolderSize(file.id) : file.size;
            tbody += `
                <tr class="${selectedFiles.includes(file.id) ? "selected" : ""}" onclick='handleFileClick(${JSON.stringify(file).replace(/'/g, "&apos;")}, event)'>
                    <td><input type="checkbox" ${selectedFiles.includes(file.id) ? "checked" : ""}></td>
                    <td>${getFileIcon(file, true)} ${file.name}</td>
                    <td>${formatFileSize(size)}</td>
                    <td>${file.modified ? new Date(file.modified).toLocaleDateString() : "-"}</td>
                </tr>
            `;
        });
        table.innerHTML = `<thead><tr><th></th><th>Nome</th><th>Tamanho</th><th>Modificado</th></tr></thead>${tbody}</tbody>`;
        elements.fileContainer.appendChild(table);
    }
    updateSelectionInfo();
}

function getFileIcon(file, isSmall = false) {
    const size = isSmall ? "20px" : "40px";
    if (file.isDirectory) return `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23facc15'%3E%3Cpath d='M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E" style="width: ${size};">`;
    
    const colors = { pdf: "#ef4444", archive: "#f59e0b", code: "#3b82f6", image: "#10b981", font: "#8b5cf6", default: "#94a3b8" };
    const color = colors[file.type] || colors.default;
    
    return `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(color)}'%3E%3Cpath d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'/%3E%3C/svg%3E" style="width: ${size};">`;
}

function handleFileClick(file, event) {
    if (event.target.type === "checkbox") {
        toggleSelection(file.id);
    } else if (file.isDirectory) {
        loadFilesFromPath(file.id);
    } else {
        openPreview(file);
    }
}

function toggleSelection(id) {
    const index = selectedFiles.indexOf(id);
    if (index === -1) selectedFiles.push(id);
    else selectedFiles.splice(index, 1);
    renderFiles();
}

function selectAll() {
    selectedFiles = files.map(f => f.id);
    renderFiles();
}

function clearSelection() {
    selectedFiles = [];
    renderFiles();
}

function updateSelectionInfo() {
    if (selectedFiles.length > 0) {
        elements.selectionInfo.style.display = "flex";
        elements.selectionCount.textContent = `${selectedFiles.length} item(s)`;
        elements.downloadSelectedBtn.style.display = "inline-block";
    } else {
        elements.selectionInfo.style.display = "none";
        elements.downloadSelectedBtn.style.display = "none";
    }
}

function setViewMode(mode) {
    viewMode = mode;
    renderFiles();
}

function formatFileSize(bytes) {
    if (!bytes) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + ["Bytes", "KB", "MB", "GB"][i];
}

function openPreview(file) {
    elements.previewTitle.textContent = file.name;
    elements.previewContent.innerHTML = file.type === "image" 
        ? `<img src="${file.path}" style="max-width:100%; max-height:70vh; display:block; margin:0 auto;">`
        : `<div style="text-align:center; padding:40px;"><div style="font-size:64px;">📄</div><p>Sem pré-visualização.</p></div>`;
    elements.previewModal.style.display = "flex";
}

function closePreview() {
    elements.previewModal.style.display = "none";
}

function downloadSelected() { alert("Download ZIP não disponível."); }
