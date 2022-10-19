import formidable from "formidable";
import fs from "fs";

export const uploadFile = async (req, res, basePath = "/images/uploaded") => {
    const { type } = req.query;
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        if(files.file) {
            const path = await saveFile(files.file, type, basePath);
            return res.status(201).json({
                status: 'success',
                data: {
                    path: path
                }
            });
        } else {
            return res.status(404).json({
                status: 'error',
                data: {
                    message: "File is required!"
                }
            });
        }
    });
};

export const saveFile = async (file, type, basePath = "/images/uploaded") => {
    const data = fs.readFileSync(file.filepath);
    const directory = `./public${basePath}/${type}`;
    const path = `${directory}/${file.originalFilename}`;

    // check folder is exist, if not then create with 777 permission
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });

    fs.writeFileSync(path, data);
    fs.unlinkSync(file.filepath);
    return path;
};
