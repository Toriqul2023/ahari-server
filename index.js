const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors=require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = 4000


const uri = "mongodb+srv://Ahari:Hhh0zIxPKOSJSbHc@cluster0.uaiap.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
 
  async function run() {
    try {
        await client.connect();
        
        const database = client.db("shop");
        const product = database.collection("product");
        const cart=database.collection("cart");
       
       
        app.get('/shop',async(req,res)=>{
          const queryPage=parseInt(req.query.page) || 0

          const allresult=await product.find({}).toArray();
        
       
          
         
           const result= await product.find().skip(20*queryPage).limit(20).toArray();
            
         
          
          
        
          res.send({result,allresult})
        })
        app.get('/cart',async(req,res)=>{
          
          const queryEmail=req.query.email
          const queryPage=parseInt(req.query.page) 
          const allresult=await cart.find({email:queryEmail}).toArray();
          let sums=0;
          for(var i=0;i<allresult.length;i++){
            sums=parseFloat(sums+allresult[i]?.price);

          }
          console.log(sums)
          
         let result;
         if(queryPage){
          result=await cart.find({email:queryEmail}).skip(3*queryPage).limit(3).toArray()
         }
           
          
        else{
           result=await cart.find({email:queryEmail}).limit(3).toArray() 
        }
        
         
            
          
  
            res.send({result,sums})
          })
             
            
       
          
        app.post('/cart',async(req,res)=>{
          const doc=req.body
        
            // Check if the product exists in the cart
            const findResults = await cart.findOne({email: doc.email,productUid:doc.productUid });
         
         
          if(findResults?.productUid==doc.productUid){
             const result=await cart.updateOne({email:findResults?.email,productUid:findResults?.productUid},{
              $set:{
                quantity:findResults?.quantity+1,
                price:findResults?.price+doc.price
              }
             })
             res.json(result)

          }
    else{
      const result = await cart.insertOne(doc);
      res.json(result);
    }
        
    console.log(findResults) 
     
         
                

        })
       
    
      }
     finally {
         
     }
  }
  run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  
})