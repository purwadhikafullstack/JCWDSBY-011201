import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploader = (dir, maxSize) => {
    const pathDir = path.join(__dirname,`../assets${dir?`/${dir}` : "" }`);
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {

            if (fs.existsSync(pathDir)) {
                cb(null, pathDir);
            } else {
                fs.mkdirSync(pathDir, (err) => {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, pathDir);
                    }
                });
            }
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(Error('Only JPG, JPEG, PNG, and GIF files are allowed.'), false);
        }
    };

    return multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * maxSize }});
};

export default uploader;