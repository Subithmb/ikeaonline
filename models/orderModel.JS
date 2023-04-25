  
const mongoose=require('mongoose')


const orderShema=mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products: [{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'product'
            },
        quantity:{
            type:Number,
            
        },
        Tprice:{
            type:Number,
            default:0
        }
        }],

    totalAmount: {
        type:Number,
        require:true
        },
        
    discount: {
        type:Number,
       default:0
        },
    updatedtotal: {
        type:Number,
       
        },
    address: {
        type: Array,
        require:true
        },
        paymentmethod: {
            type:String,
            require:true
            },
            orderId: {
            type:String,
            },
        orderStatus: {
            type:String,
           default:'orderd'
            },
            paymentStatus: {
                type:String,
           default:'pending'
                },
    
            date: {
                type:Date,
         
                }
    
},
{timestamps:true}
)

module.exports=mongoose.model('order',orderShema)