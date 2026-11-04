import mongoose from 'mongoose';


const orderSchema=mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
  },
  orderItems:[
    {
      name:{type:String,required:true},
      qty:{type:Number,required:true},
      image:{type:String,required:true},
      price:{type:Number,required:true},
      product:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Product",
      }
    }
  ],
  shippingAddress:{
    address:{
      type:String,
      required:true,
    },
    city:{
      type:String,
      required:true,
    },
    postalCode:{
      type:String,
      required:true,
    },
    country:{
      type:String,
      required:true,
    }
  },

  paymentMethod:{
    type:String,
    required:true,
  },
  // The PayPal order this server created. It is the only one that can pay this order.
  paypalOrderId:{
    type:String,
  },
  paymentResult:{
    id:{type:String},
    status:{type:String},
    update_time:{type:String},
    email_address:{type:String},
  },
  itemsPrice:{
    type:Number,
    required:true,
    default:0.0,
  },
  taxPrice:{
    type:Number,
    required:true,
    default:0.0,
  },
  shippingPrice:{
    type:Number,
    required:true,
    default:0.0,
  },

  totalPrice:{
    type:Number,
    required:true,
    default:0.0,
  },
  isPaid:{
    type:Boolean,
    required:true,
    default:false,
  },
  paidAt:{
    type:Date,
  },
  isDelivered:{
    type:Boolean,
    required:true,
    default:false,
  },

  deliveredAt:{
    type:Date,
  }

},{timestamps:true})

// One PayPal transaction can only ever pay one order. Sparse skips unpaid orders.
orderSchema.index({'paymentResult.id':1},{unique:true,sparse:true})


const Order=mongoose.model('Order',orderSchema);

// Index builds fail silently otherwise, e.g. if existing orders share a transaction ID
Order.on('index',(err)=>{
  if(err){
    console.error('Order index build failed, duplicate payments are not blocked:',err.message);
  }
});

export default Order;