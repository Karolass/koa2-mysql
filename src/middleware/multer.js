import multer from 'koa-multer'
import uuidv1 from 'uuid/v1'
import path from 'path'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, '../../public/uploads'))
  },
  filename(req, file, cb) {
    cb(null, `${uuidv1()}.${file.originalname.split('.')[1]}`)
  },
})

const upload = multer({ storage })

export const single = fieldName => upload.single(fieldName)

// export const array = (fieldName, maxCount) => upload.array(fieldName, maxCount)
