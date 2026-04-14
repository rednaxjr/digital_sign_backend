const shared = require('../middleware/shared');
var paths = require("path");
const fs = require('fs');
const mime = require('mime-types');

const getProtocol = (req) => req.headers['x-forwarded-proto'] || req.protocol;
const basePath = process.env.BASE_PATH || '';

const get_files = (req, res) => {
    const folderPath = paths.join(process.cwd(), 'uploaded_files');
    const digitalSignDir = paths.join(process.cwd(), 'uploaded_files/digital_sign');
    const protocol = getProtocol(req);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read the folder' });
        }

        const pdfFiles = files.filter(file => paths.extname(file).toLowerCase() === '.pdf');

        const fileDetails = pdfFiles.map(file => {
            const filePath = paths.join(folderPath, file);
            const stats = fs.statSync(filePath);
            const mimeType = mime.lookup(file);
            const ftype = shared.detectMimeType(mimeType);
            const d = new Date(stats.mtime);
            const time = d.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true });
            const date = d.toLocaleString('default', { year: 'numeric', day: '2-digit', month: 'long' });

            const folderName = paths.basename(file, '.pdf');
            const matchingSignDir = paths.join(digitalSignDir, folderName);

            let signatures = [];
            if (fs.existsSync(matchingSignDir)) {
                signatures = fs.readdirSync(matchingSignDir)
                    .filter(f => f.endsWith('.png'))
                    .map(f => ({
                        filename: f,
                        name: f.replace('.png', ''),
                        url: `${protocol}://${req.get('host')}${basePath}/uploaded_files/digital_sign/${folderName}/${f}`, // ✅ fixed
                        uploadedAt: fs.statSync(paths.join(matchingSignDir, f)).mtime,
                    }));
            }

            return {
                url: `${protocol}://${req.get('host')}${basePath}/uploaded_files/${file}`, // ✅ added basePath
                name: file,
                size: stats.size,
                type: ftype,
                time: time,
                date: date,
                signatureCount: signatures.length,
                signatures: signatures,
            };
        });

        return res.json({ pdf: fileDetails });
    });
};

const uploadFile = async (req, res) => {
    try {
        const files = req.files;
        const data = JSON.parse(req.body.sign_data);

        const parent_file = data.data.pdf.name.replace('.pdf', '');
        const uploadDir = paths.join(process.cwd(), 'uploaded_files/digital_sign/' + parent_file);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const date = new Date();
        const date_ = date.toLocaleString('default', { month: "2-digit", day: "2-digit", year: "numeric" });
        const new_name = parent_file.trim() + "-" + date_;
        const sanitizedName = new_name.replace(/[^a-z0-9_\-]/gi, '');
        const filePath = paths.join(uploadDir, sanitizedName + '.png');

        fs.writeFileSync(filePath, files[0].buffer);

        return res.status(200).json({ message: 'File uploaded successfully', path: filePath, status: "success" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllFiles = (req, res) => {
    const uploadDir = paths.join(process.cwd(), 'uploaded_files/');
    const protocol = getProtocol(req);

    const folders = fs.readdirSync(uploadDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            const folderPath = paths.join(uploadDir, dirent.name);
            const files = fs.readdirSync(folderPath)
                .filter(f => f.endsWith('.png'))
                .map(f => ({
                    filename: f,
                    name: f.replace(".png", ""),
                    url: `${protocol}://${req.get('host')}${basePath}/uploaded_files/${dirent.name}/${f}`, // ✅
                    uploadedAt: fs.statSync(paths.join(folderPath, f)).mtime,
                }));

            return {
                folder: dirent.name,
                signatureCount: files.length,
                signatures: files,
            };
        });

    return res.status(200).json({ folders });
};

const delete_file = async (req, res) => {
    console.log(req.body)
    const data = req.body;
    if (!data) {
        return res.status(400).json({ error: 'File name is required' });
    }

    const protocol = getProtocol(req);
    const file_name = data.url
        .replace(`${protocol}://${req.get('host')}${basePath}/uploaded_files/`, "")
    const folder_name = file_name.replace('.pdf', '');
    console.log("folder name:" + folder_name)
    const filePath = paths.join(process.cwd(), 'uploaded_files', folder_name);
    console.log("file path:" + filePath)


    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to delete file' });
        }
        const folderPath = paths.dirname(filePath);

        console.log("to_remove:" + filePath)
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Unable to delete folder' });
            }
            res.json({ message: 'File and folder deleted successfully' });
        });
    });
};

const deletea = async (req, res) => {
    const data = req.body;
    const folderPath = paths.join(process.cwd(), 'uploaded_files/' + data.folder);

    try {
        if (!fs.existsSync(folderPath)) {
            return res.status(404).json({ message: 'Folder not found.' });
        }
        fs.rmSync(folderPath, { recursive: true, force: true });
        return res.status(200).json({ message: `Folder "${data.folder}" deleted successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const get_pdf = async (req, res) => {
    const filePath = paths.join(process.cwd(), 'uploaded_files', req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const protocol = getProtocol(req);
    res.setHeader('Access-Control-Allow-Origin', `${protocol}://${req.get('host')}`);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');

    res.sendFile(filePath);
};

module.exports = {
    get_pdf,
    uploadFile,
    getAllFiles,
    get_files,
    delete_file,
    deletea
};