const cloudinary =require('cloudinary').v2
const apiSecret = cloudinary.config().api_secret;

cloudinary.config({
    cloud_name: 'codesoftic-com', 
    api_key: 288149184289838,
    api_secret: 'YYLXx0k0jwIU2vxz6ILyDilfA_E',
  })


  module.exports = cloudinary


