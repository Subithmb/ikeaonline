  
const mongoose=require('mongoose')


const wishlistShema=mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
   
    products:[
       {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'product'
        },
        }
    ]
},
{
    timestamps:true
}
)



module.exports=mongoose.model('wishlist',wishlistShema)