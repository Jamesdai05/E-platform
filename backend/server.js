// console.log("Hello world");
import express from "express"
const app=express()

const port =5002

app.get("/",(req,res)=>{
  res.send("API is running...")
})

app.listen(port,()=>{
  console.log(`Server is listening on port ${port}.`);
})