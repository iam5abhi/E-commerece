const multer  = require('multer')


const Stroge = multer.diskStorage({
    filename:function(req,file,cb){
        
         cb(null, file.originalname)
        
    }
})




const upload = multer({ storage: Stroge })

module.exports =upload