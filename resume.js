import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar las variables del archivo .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Obtener las variables del .env
const EXCLUDE_DIRECTORIES = process.env.EXCLUDE_DIRS ? process.env.EXCLUDE_DIRS.split(',') : [];
const EXCLUDE_FILES = process.env.EXCLUDE_FILES ? process.env.EXCLUDE_FILES.split(',') : [];

class File {
    constructor(filePath, content, isBinary = false) {
        this.path = filePath;
        this.content = content;
        this.isBinary = isBinary;
    }
}

class Directory {
    constructor(directoryPath) {
        this.path = directoryPath;
        this.subdirectories = [];
        this.files = [];
    }
}

function addEnvVariables() {
    const envFilePath = path.resolve(__dirname, '.env');

    // Variables a agregar
    const newVariables = `
EXCLUDE_DIRS=node_modules,.nuxt
EXCLUDE_FILES=package-lock.json,dev.db,dev.db-journal,favicon.ico,.DS_Store,files_details.txt,files_details.txt,resume.js
PROJECT_DESCRIPTION=your_project_description_here`;

    // Verificar si el archivo .env existe
    if (fs.existsSync(envFilePath)) {
        // Leer el contenido del archivo .env
        const envContent = fs.readFileSync(envFilePath, 'utf8');

        // Verificar si las variables ya existen
        const hasExcludeDirs = envContent.includes('EXCLUDE_DIRS=');
        const hasExcludeFiles = envContent.includes('EXCLUDE_FILES=');
        const hasProjectDescription = envContent.includes('PROJECT_DESCRIPTION=');

        if (!hasExcludeDirs || !hasExcludeFiles || !hasProjectDescription) {
            // Agregar solo las variables que no existen
            let variablesToAdd = '';
            if (!hasExcludeDirs) variablesToAdd += '\nEXCLUDE_DIRS=node_modules,.nuxt';
            if (!hasExcludeFiles) variablesToAdd += '\nEXCLUDE_FILES=package-lock.json,dev.db,dev.db-journal,favicon.ico,files_details.txt,.DS_Store,files_details.txt,resume.js';
            if (!hasProjectDescription) variablesToAdd += '\nPROJECT_DESCRIPTION=your_project_description_here';

            fs.appendFileSync(envFilePath, variablesToAdd, 'utf8');
            console.log('.env file updated with new variables.');
        } else {
            console.log('All variables already exist in the .env file.');
        }
    } else {
        // Crear el archivo .env con las nuevas variables
        fs.writeFileSync(envFilePath, newVariables.trim(), 'utf8');
        console.log('.env file created and variables added.');
    }
}

// Ejecutar la función
addEnvVariables();

// Obtener archivos y directorios, excluyendo los especificados
function getFilesAndDirectories(dirPath) {
    const rootDir = new Directory(dirPath);
    const excludedPaths = { directories: [], files: [] };

    function addToDirectory(dirObj, currentPath) {
        fs.readdirSync(currentPath).forEach(entry => {
            const fullPath = path.join(currentPath, entry);
            if (fs.statSync(fullPath).isDirectory()) {
                if (EXCLUDE_DIRECTORIES.includes(entry)) {
                    excludedPaths.directories.push(fullPath);
                    return;
                }
                const subdir = new Directory(fullPath);
                dirObj.subdirectories.push(subdir);
                addToDirectory(subdir, fullPath);
            } else {
                if (EXCLUDE_FILES.includes(entry)) {
                    excludedPaths.files.push(fullPath);
                    return;
                }
                const fileObj = new File(fullPath, '');
                dirObj.files.push(fileObj);
            }
        });
    }

    addToDirectory(rootDir, dirPath);
    return { rootDir, excludedPaths };
}

// Obtener detalles de los archivos, excluyendo los especificados
function getFileDetails(dirPath) {
    const archivos = [];
    const excludedPaths = { directories: [], files: [] };

    function addFileDetails(currentPath) {
        fs.readdirSync(currentPath).forEach(entry => {
            const fullPath = path.join(currentPath, entry);
            if (fs.statSync(fullPath).isDirectory()) {
                if (EXCLUDE_DIRECTORIES.includes(entry)) {
                    excludedPaths.directories.push(fullPath);
                    return;
                }
                addFileDetails(fullPath);
            } else {
                if (EXCLUDE_FILES.includes(entry)) {
                    excludedPaths.files.push(fullPath);
                    return;
                }
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const contentWithTags = `<contenidoarchivo>${content}</contenidoarchivo>`;
                    archivos.push(new File(fullPath, contentWithTags));
                } catch (error) {
                    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
                        return;
                    }
                    const content = fs.readFileSync(fullPath);
                    archivos.push(new File(fullPath, content, true));
                }
            }
        });
    }

    addFileDetails(dirPath);
    return { archivos, excludedPaths };
}

// Obtener el directorio actual
const currentDirectory = process.cwd();

// Obtener estructura de directorios
const { rootDir, excludedPaths: excludedDirs } = getFilesAndDirectories(currentDirectory);
const { archivos, excludedPaths: excludedFiles } = getFileDetails(currentDirectory);

const result = {
    thisinfo: {
        whatis: "Contains all files and subdirectories of a project, excluding specified directories and files",
        howto: "directoryStructure: an object containing the directory and file structure, others: contains the excluded directories and files, fileDetails: contains the details (content) of the files"
    },
    directoryStructure: rootDir,
    others: {
        directories: excludedDirs.directories,
        files: excludedFiles.files
    },
    fileDetails: archivos,
};

// Guardar resultado en un archivo
fs.writeFileSync('files_details.txt', JSON.stringify(result, null, 4), 'utf-8');
