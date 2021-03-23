const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema={
  name :{
    type : String,
    required: true
  }
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name : "Welcome to todolist."
});
const item2 = new Item({
  name : "<-- Hit this to delete an item."
});
const item3 = new Item({
  name : "Hit + button to add a new item."
});

const allItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(allItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("successful");
        }
      });
      res.redirect("/");
    }else{
        res.render("list", { listTitle: "Today", listItems: foundItems});
    }

  });


});

app.post("/", function(req, res){
   const itemName = req.body.newItem;
   const item = new Item({
     name : itemName
   });
   item.save();

   res.redirect("/");

});

app.post("/delete", function(req, res){
  const deleteItem = req.body.checkbox;
  Item.findByIdAndDelete(deleteItem, function(err, deleted){
    if(err){
      console.log(err);
    }else{
      console.log("Successfully deleted");
    }
  });
  res.redirect("/");
});

app.get("/work", function(req,res){
    res.render("list", {listTitle:"Work List", listItems:workItems});
})

app.listen(3000, function() {
  console.log("Server running at port 3000");
});
